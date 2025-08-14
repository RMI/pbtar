from json_schema_for_humans.generate import generate_from_filename
from json_schema_for_humans.generation_configuration import GenerationConfiguration

config = GenerationConfiguration(
        expand_buttons=True,
        footer_show_time=False,
        minify=True,
        show_breadcrumbs=True,
        show_toc=True,
        template_name="js_offline",
        with_footer=True
        )

generate_from_filename(
        schema_file_name = "public/schema.json",
        result_file_name = "public/schema.html",
        config = config
        )
