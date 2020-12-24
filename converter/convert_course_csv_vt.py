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
    'STAT': 'College of Science',
    'CSES': 'College of Agriculture and Life Sciences',
    'EDCT': 'College of Liberal Arts and Human Sciences',
    'EDIT': 'College of Liberal Arts and Human Sciences',
    'RUS': 'College of Liberal Arts and Human Sciences',
    'LAT': 'College of Liberal Arts and Human Sciences',
    'STL': 'College of Science',
    'BMVS': 'College of Veterinary Medicine',
    'MGT': 'Pamplin College of Business',
    'JPN': 'College of Liberal Arts and Human Sciences',
    'TBMH': 'InterCollege',
    'HTM': 'Pamplin College of Business',
    'CONS': 'College of Liberal Arts and Human Sciences',
    'PORT': 'College of Liberal Arts and Human Sciences',
    'CNST': 'College of Architecture and Urban Studies',
    'ARCH': 'College of Architecture and Urban Studies',
    'SPES': 'College of Agriculture and Life Sciences',
    'UH': 'InterCollege',
    'FIN': 'Pamplin College of Business',
    'NSEG': 'College of Engineering',
    'FREC': 'College of Natural Resources and Environment',
    'FST': 'College of Agriculture and Life Sciences',
    'PHIL': 'College of Liberal Arts and Human Sciences',
    'HORT': 'College of Agriculture and Life Sciences',
    'AOE': 'College of Engineering',
    'MKTG': 'Pamplin College of Business',
    'HD': 'College of Liberal Arts and Human Sciences',
    'CS': 'College of Engineering',
    'PSYC': 'College of Science',
    'FL': 'College of Liberal Arts and Human Sciences',
    'JMC': 'College of Liberal Arts and Human Sciences',
    'AS': 'College of Liberal Arts and Human Sciences',
    'BMES': 'College of Engineering',
    'ISC': 'College of Science',
    'ECON': 'College of Science',
    'ART': 'College of Architecture and Urban Studies',
    'APSC': 'College of Agriculture and Life Sciences',
    'WGS': 'College of Liberal Arts and Human Sciences',
    'MN': 'College of Liberal Arts and Human Sciences',
    'COMM': 'College of Liberal Arts and Human Sciences',
    'AHRM': 'College of Liberal Arts and Human Sciences',
    'C21S': 'College of Liberal Arts and Human Sciences',
    'IDS': 'College of Architecture and Urban Studies',
    'ITAL': 'College of Liberal Arts and Human Sciences',
    'PSCI': 'College of Liberal Arts and Human Sciences',
    'ENSC': 'College of Agriculture and Life Sciences',
    'EDCI': 'College of Liberal Arts and Human Sciences',
    'FIW': 'College of Natural Resources and Environment',
    'JUD': 'College of Liberal Arts and Human Sciences',
    'EDCO': 'College of Liberal Arts and Human Sciences',
    'CLA': 'College of Liberal Arts and Human Sciences',
    'ISE': 'College of Engineering',
    'PHS': 'College of Veterinary Medicine',
    'RED': 'College of Liberal Arts and Human Sciences',
    'GIA': 'College of Architecture and Urban Studies',
    'DASC': 'College of Agriculture and Life Sciences',
    'BC': 'College of Architecture and Urban Studies',
    'EDHE': 'College of Liberal Arts and Human Sciences',
    'AT': 'College of Agriculture and Life Sciences',
    'MINE': 'College of Engineering',
    'MSE': 'College of Engineering',
    'COS': 'College of Science',
    'SBIO': 'College of Natural Resources and Environment',
    'GEOG': 'College of Natural Resources and Environment',
    'BCHM': 'College of Agriculture and Life Sciences',
    'CRIM': 'College of Liberal Arts and Human Sciences',
    'REAL': 'Pamplin College of Business',
    'MACR': 'InterCollege',
    'CAUS': 'College of Architecture and Urban Studies',
    'HNFE': 'College of Agriculture and Life Sciences',
    'PPWS': 'College of Agriculture and Life Sciences',
    'PSVP': 'College of Liberal Arts and Human Sciences',
    'ME': 'College of Engineering',
    'ALS': 'College of Agriculture and Life Sciences',
    'ALCE': 'College of Agriculture and Life Sciences',
    'GRAD': 'InterCollege',
    'AINS': 'College of Liberal Arts and Human Sciences',
    'PHYS': 'College of Science',
    'HEB': 'College of Liberal Arts and Human Sciences',
    'DANC': 'College of Liberal Arts and Human Sciences',
    'GBCB': 'InterCollege',
    'MS': 'College of Liberal Arts and Human Sciences',
    'ACIS': 'Pamplin College of Business',
    'ASPT': 'College of Liberal Arts and Human Sciences',
    'FCS': 'Pamplin College of Business',
    'AAEC': 'College of Agriculture and Life Sciences',
    'UAP': 'College of Architecture and Urban Studies',
    'BIT': 'Pamplin College of Business',
    'EDRE': 'College of Liberal Arts and Human Sciences',
    'EDP': 'College of Architecture and Urban Studies',
    'CEM': 'College of Architecture and Urban Studies',
    'SPAN': 'College of Liberal Arts and Human Sciences',
    'LDRS': 'College of Agriculture and Life Sciences',
    'BMSP': 'College of Veterinary Medicine',
    'ENGE': 'College of Engineering',
    'CHEM': 'College of Science',
    'ENGR': 'College of Engineering',
    'CHE': 'College of Engineering',
    'FA': 'College of Liberal Arts and Human Sciences',
    'MTRG': 'College of Natural Resources and Environment',
    'NEUR': 'College of Science',
    'FMD': 'College of Liberal Arts and Human Sciences',
    'CEE': 'College of Engineering',
    'ECE': 'College of Engineering',
    'VM': 'College of Veterinary Medicine',
    'MUS': 'College of Liberal Arts and Human Sciences',
    'CHN': 'College of Liberal Arts and Human Sciences',
    'GEOS': 'College of Science',
    'SPIA': 'College of Architecture and Urban Studies',
    'WATR': 'College of Natural Resources and Environment',
    'RLCL': 'College of Liberal Arts and Human Sciences',
    'EDEL': 'College of Liberal Arts and Human Sciences',
    'PR': 'College of Liberal Arts and Human Sciences',
    'BIOL': 'College of Science',
    'IS': 'College of Liberal Arts and Human Sciences',
    'UNIV': 'InterCollege',
    'GR': 'College of Liberal Arts and Human Sciences',
    'HUM': 'College of Liberal Arts and Human Sciences',
    'CMST': 'College of Liberal Arts and Human Sciences',
    'APS': 'College of Liberal Arts and Human Sciences',
    'FR': 'College of Liberal Arts and Human Sciences',
    'EDEP': 'College of Liberal Arts and Human Sciences',
    'STS': 'College of Liberal Arts and Human Sciences',
    'PAPA': 'College of Architecture and Urban Studies',
    'ESM': 'College of Engineering',
    'LAHS': 'College of Liberal Arts and Human Sciences',
    'NANO': 'College of Science',
    'HIST': 'College of Liberal Arts and Human Sciences',
    'MATH': 'College of Science',
    'SYSB': 'College of Science',
    'PM': 'College of Liberal Arts and Human Sciences',
    'ENGL': 'College of Liberal Arts and Human Sciences',
    'NR': 'College of Natural Resources and Environment',
    'ITDS': 'College of Architecture and Urban Studies',
    'LAR': 'College of Architecture and Urban Studies',
    'TA': 'College of Liberal Arts and Human Sciences',
    'SOC': 'College of Liberal Arts and Human Sciences',
    'BDS': 'College of Science',
    'BSE': 'College of Agriculture and Life Sciences',
    'CINE': 'College of Liberal Arts and Human Sciences',
    'ENT': 'College of Agriculture and Life Sciences',
    'GER': 'College of Liberal Arts and Human Sciences',
    'CMDA': 'College of Science',
    'AFST': 'College of Liberal Arts and Human Sciences',
    'ARBC': 'College of Liberal Arts and Human Sciences',
    'FOR': 'College of Natural Resources and Environment',
    'WOOD': 'College of Natural Resources and Environment',
    'BTDM': 'College of Science',
    'MASC': 'College of Science',
    'ALHR': 'College of Liberal Arts and Human Sciences',
    'EDHP': 'College of Liberal Arts and Human Sciences',
    'EDTE': 'College of Liberal Arts and Human Sciences',
    'IDST': 'College of Liberal Arts and Human Sciences',
    'REL': 'College of Liberal Arts and Human Sciences',
    'WS': 'College of Liberal Arts and Human Sciences',
    'RTM': 'InterCollege',
    'BUS': 'Pamplin College of Business',
    'AEE': 'College of Agriculture and Life Sciences',
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
parser.add_argument('--meta', type=str, default="False", help="Generate course meta info or schedule info")
parser.add_argument('--meta_id_map', help="JSON file path containing mapping from course title to db id")
args = parser.parse_args()
args_dict = vars(args)

args_dict["meta"] = {"True": True, "False": False}.get(args_dict["meta"], False)

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
