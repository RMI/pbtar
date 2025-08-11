from json_schema_for_humans.generate import generate_from_filename
from json_schema_for_humans.generation_configuration import GenerationConfiguration

config = GenerationConfiguration(
        copy_css=False,
        expand_buttons=True,
        collapse_long_descriptions=True,
        template_name="js",
        with_footer=True,
        footer_show_time=False
        )

generate_from_filename(
        schema_file_name = "public/schema.json",
        result_file_name = "public/schema.html",
        config = config
        )
