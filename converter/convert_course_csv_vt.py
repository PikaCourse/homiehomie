# Helper script to convert VT course file into CSV and load into db

import csv
import json
from tqdm import tqdm

weekday_map = {
    "M": 0,
    "T": 1,
    "W": 2,
    "R": 3,
    "F": 4,
    "S": 5,
    "U": 6
}

type_map = {
    "L": "lecture",
    "B": "lab",
    "I": "other",
    "C": "recitation",
    "R": "research",
    "O": "online"
}

college_map = {
    'STAT': '',
    'CSES': '',
    'EDCT': '',
    'EDIT': '',
    'RUS': '',
    'LAT': '',
    'STL': '',
    'BMVS': '',
    'MGT': '',
    'JPN': '',
    'TBMH': '',
    'HTM': '',
    'CONS': '',
    'PORT': '',
    'CNST': '',
    'ARCH': '',
    'SPES': '',
    'UH': '',
    'FIN': '',
    'NSEG': '',
    'FREC': '',
    'FST': '',
    'PHIL': '',
    'HORT': '',
    'AOE': 'College of Engineering',
    'MKTG': '',
    'HD': '',
    'CS': '',
    'PSYC': '',
    'FL': '',
    'JMC': '',
    'AS': '',
    'BMES': '',
    'ISC': '',
    'ECON': '',
    'ART': '',
    'APSC': '',
    'WGS': '',
    'MN': '',
    'COMM': '',
    'AHRM': 'College of Liberal Arts and Human Sciences',
    'C21S': '',
    'IDS': '',
    'ITAL': '',
    'PSCI': '',
    'ENSC': '',
    'EDCI': '',
    'FIW': '',
    'JUD': '',
    'EDCO': '',
    'CLA': '',
    'ISE': '',
    'PHS': '',
    'RED': '',
    'GIA': '',
    'DASC': '',
    'BC': '',
    'EDHE': '',
    'AT': '',
    'MINE': '',
    'MSE': '',
    'COS': '',
    'SBIO': '',
    'GEOG': '',
    'BCHM': '',
    'CRIM': '',
    'REAL': '',
    'MACR': '',
    'CAUS': '',
    'HNFE': '',
    'PPWS': '',
    'PSVP': '',
    'ME': '',
    'ALS': 'College of Agriculture and Life Sciences',
    'ALCE': 'College of Agriculture and Life Sciences',
    'GRAD': '',
    'AINS': 'College of Liberal Arts and Human Sciences',
    'PHYS': '',
    'HEB': '',
    'DANC': '',
    'GBCB': '',
    'MS': '',
    'ACIS': 'Pamplin College of Business',
    'ASPT': '',
    'FCS': '',
    'AAEC': 'College of Agriculture and Life Sciences',
    'UAP': '',
    'BIT': '',
    'EDRE': '',
    'EDP': '',
    'CEM': '',
    'SPAN': '',
    'LDRS': '',
    'BMSP': '',
    'ENGE': '',
    'CHEM': '',
    'ENGR': '',
    'CHE': '',
    'FA': '',
    'MTRG': '',
    'NEUR': '',
    'FMD': '',
    'CEE': '',
    'ECE': '',
    'VM': '',
    'MUS': '',
    'CHN': '',
    'GEOS': '',
    'SPIA': '',
    'WATR': '',
    'RLCL': '',
    'EDEL': '',
    'PR': '',
    'BIOL': '',
    'IS': '',
    'UNIV': '',
    'GR': '',
    'HUM': '',
    'CMST': '',
    'APS': '',
    'FR': '',
    'EDEP': '',
    'STS': '',
    'PAPA': '',
    'ESM': '',
    'LAHS': '',
    'NANO': '',
    'HIST': '',
    'MATH': '',
    'SYSB': '',
    'PM': '',
    'ENGL': '',
    'NR': '',
    'ITDS': '',
    'LAR': '',
    'TA': '',
    'SOC': '',
    'BDS': '',
    'BSE': '',
    'CINE': '',
    'ENT': '',
    'GER': '',
    'CMDA': '',
    'AFST': 'College of Liberal Arts and Human Sciences',
    'ARBC': 'College of Liberal Arts and Human Sciences',
    'BTDM': '',
    'EDTE': 'College of Liberal Arts and Human Sciences',
    'BUS' : 'College of Liberal Arts and Human Sciences'
}

# parse arguments
import argparse

parser = argparse.ArgumentParser(description='Homiehomie VT Course Data Convert tool\n'
                                             'Convert original files from github to formatted'
                                             'CSV file to be uploaded to db')
parser.add_argument('--input', required=True, help="Input file path")
parser.add_argument('--delimit', default=",")
parser.add_argument('--year', type=int, default=2020)
parser.add_argument('--semester', default="fall")
parser.add_argument('--meta', type=bool, default=False, help="Generate course meta info or schedule info")
parser.add_argument('--meta_id_map', help="JSON file path containing mapping from course title to db id")
args = parser.parse_args()
args_dict = vars(args)

args_dict["meta"] = {"True": True, "False": False}.get(args_dict["delimit"], False)

if not args_dict["meta"] and args_dict["meta_id_map"] is None:
    print("Need to provide a meta id mapping JSON when generating course csv!")
    exit(1)


def convert_to_24(timestring):
    # AM and 12PM
    if "ARR" in timestring or "TBA" in timestring:
        timestring = ""
    elif timestring[-2:] == "AM" or timestring[:2] == "12":
        timestring = timestring[:-2]
        # 12 AM convert to 00
        if timestring[-2:] == "AM" and timestring[:2] == "12":
            timestring = "00" + timestring[2:-2]
    else:
        tmp = timestring[:-2].split(":")
        hour = tmp[0]
        minute = tmp[1]
        hour = str(int(hour) + 12)
        timestring = hour + ":" + minute
    return timestring


input_file = args_dict["input"]
course_file = open(input_file)
school = "Virgina Tech"

# Read delimiter setting
dialect = csv.excel()
dialect.delimiter = {"TAB": "\t"}.get(args_dict["delimit"], args_dict["delimit"])


if args_dict["meta"]:
    course_out = open(input_file.split(".")[0] + "_out_meta.csv", "w")
    # Specify output csv header
    field_names = ["major", "college", "title",
                   "name", "credit_hours", "school",
                   "description", "tags"]

    # Gather column that can be pass into output directly
    reader_field_names = ["course", "name", "credit_hours"]

    reader = csv.DictReader(course_file, dialect=dialect)
    writer = csv.DictWriter(course_out, fieldnames=field_names)
    writer.writeheader()
    rows = tqdm(reader, desc="Converting course meta file")
    course_set = set()
    for row in rows:
        # init output row
        writer_row = dict.fromkeys(field_names)

        title = row["course"]
        if title in course_set:
            continue
        else:
            course_set.add(title)

        # Meta fields
        writer_row["school"] = school

        # Bypass fields
        writer_row["title"] = title
        writer_row["name"] = row["name"]
        writer_row["credit_hours"] = row["credit_hours"]

        # Hash fields
        subject = row["course"].split("-")[0]
        college = college_map[subject]
        description = "Empty"
        writer_row["major"] = subject
        writer_row["college"] = college
        writer_row["description"] = description

        # Empty tags field
        writer_row["tags"] = "[]"
        writer.writerow(writer_row)
    course_out.close()
else:
    map_file = open(args_dict["meta_id_map"])
    title_id_lookup = json.loads(map_file.readline())
    course_out = open(input_file.split(".")[0] + "_out.csv", "w")

    # Specify output csv header
    field_names = ["course_meta_id", "crn", "time",
                   "capacity", "type", "professor",
                   "year", "semester", "location"]

    year = args_dict["year"]
    semester = args_dict["semester"]

    # Gather column that can be pass into output directly
    reader_field_names = ["crn", "capacity",
                          "professor", "location"]

    reader = csv.DictReader(course_file, dialect=dialect)
    writer = csv.DictWriter(course_out, fieldnames=field_names)
    writer.writeheader()

    time_template = {'weekday': 0, 'start_at': 'HH:MM', 'end_at': 'HH:MM'}
    rows = tqdm(reader, desc="Converting course file")
    for row in rows:
        # init output row
        writer_row = dict.fromkeys(field_names)
        # print(row["crn"])
        # Meta fields
        writer_row["year"] = year
        writer_row["semester"] = semester

        # Bypass fields
        for column in reader_field_names:
            writer_row[column] = row[column]

        # Hash fields
        writer_row["course_meta_id"] = title_id_lookup[row["course"]]
        writer_row["type"] = type_map[row["type"]]

        # Time json field
        time_array = list()
        # Check if the course has a fixed time schedule
        # TODO Better handling
        if (row["weekday"] is not None and row["weekday"] != ""
            and row["weekday"] != "ARR" and row["weekday"] != "(ARR)") \
                and row["weekday"] != "":
            weekdays = row["weekday"].split(" ")
            # Convert from 12 hours to 24 hours
            start_at = convert_to_24(row["start_at"])
            end_at = convert_to_24(row["end_at"])
            for weekday in weekdays:
                tmp = time_template.copy()
                tmp["weekday"] = weekday_map[weekday]
                tmp["start_at"] = start_at
                tmp["end_at"] = end_at
                time_array.append(tmp)
        writer_row["time"] = json.dumps(time_array)

        writer.writerow(writer_row)
    course_out.close()

course_file.close()
