# Helper script to convert CSV from course meta id title dump to JSON

import json
import csv
import argparse

parser = argparse.ArgumentParser(description='Homiehomie VT Course Data Convert tool\n'
                                             'Convert id-title CSV dump from DataGrip\n'
                                             'to JSON file to be lookup later\n'
                                             'CSV must only have two columns:\n'
                                             '\tthe first one is the id\n'
                                             '\tthe second one is the course title')
parser.add_argument('-i', required=True, help="Input file path")
parser.add_argument('-o', default="./out.json", help="Output json file path")
args = parser.parse_args()
args_dict = vars(args)

input_file = args_dict["i"]
out_file = args_dict["o"]


input = open(input_file)
reader = csv.reader(input)
title_id_map = dict()

for row in reader:
    title_id_map[row[1]] = row[0]

out = open(out_file, "w")
out.write(json.dumps(title_id_map))

out.close()
input.close()
