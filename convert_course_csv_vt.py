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
    'AFST': 'College of Liberal Arts and Human Sciences'
}


def convert_to_24(timestring):
    # AM and 12PM
    if timestring[-2:] == "AM" or timestring[:2] == "12":
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


vt_dir = "data/course/VT/"
course_file = open(vt_dir + "202009.csv")
course_out = open(vt_dir + "202009_out.csv", "w")

# Specify output csv header
field_names = ["major", "college", "course", "name", "crn", "time",
               "credit_hours", "capacity", "type", "school", "professor",
               "year", "semester", "location", "description", "tags"]
year = 2020
semester = "fall"
school = "Virgina Tech"

# Gather column that can be pass into output directly
reader_field_names = ["crn", "course", "name", "credit_hours", "capacity",
                      "professor", "location"]

reader = csv.DictReader(course_file)
writer = csv.DictWriter(course_out, fieldnames=field_names)
writer.writeheader()

time_template = {'weekday': 0, 'start_at': 'HH:MM', 'end_at': 'HH:MM'}

for row in tqdm(reader, desc="Converting course file"):
    # init output row
    writer_row = dict.fromkeys(field_names)

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
    if row["weekday"] != "ARR" and row["weekday"] != "":
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
