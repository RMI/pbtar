import csv
from pydantic import ValidationError
from importlib import resources
from models.outputs import mtcar


# Function to read in csv, validate using mtcar model and output mtcars data in JSON
def mtcars_csv_to_dict(mtcars_path):
    mtcars_data = []
    with open(mtcars_path) as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                # replaces the space in the model of each row, so it will be a valid url later
                row["model"] = row["model"].replace(" ", "")
                # validates row of csv against mtcar model
                validated_row = mtcar.model_validate(row)
                # dumps individual validated "mtcar" into list mtcars_data
                mtcars_data.append(validated_row.model_dump())
            # error message for if a row fails validation
            except ValidationError as e:
                print(f"Error validating row {row}: {e}")
    return mtcars_data


mtcars_path = resources.files("data").joinpath("mtcars.csv")

MTCARS_DATA = mtcars_csv_to_dict(mtcars_path)
