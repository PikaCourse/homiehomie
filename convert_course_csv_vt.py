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
args = parser.parse_args()
args_dict = vars(args)


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
course_out = open(input_file.split(".")[0] + "_out.csv", "w")

# Specify output csv header
field_names = ["major", "college", "course", "name", "crn", "time",
               "credit_hours", "capacity", "type", "school", "professor",
               "year", "semester", "location", "description", "tags"]

year = args_dict["year"]
semester = args_dict["semester"]
school = "Virgina Tech"

# Gather column that can be pass into output directly
reader_field_names = ["crn", "course", "name", "credit_hours", "capacity",
                      "professor", "location"]

dialect = csv.excel()
dialect.delimiter = {"TAB": "\t"}.get(args_dict["delimit"], args_dict["delimit"])
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
    writer_row["school"] = school

    # Bypass fields
    for column in reader_field_names:
        writer_row[column] = row[column]

    # Hash fields
    subject = row["course"].split("-")[0]
    type = type_map[row["type"]]
    college = college_map[subject]
    description = "Empty"
    writer_row["major"] = subject
    writer_row["type"] = type
    writer_row["college"] = college
    writer_row["description"] = description

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

    # Empty tags field
    writer_row["tags"] = "[]"

    writer.writerow(writer_row)

course_file.close()
course_out.close()
