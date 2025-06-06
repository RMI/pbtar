# Scenario metadata for the pbtar repo

The [`src/data`](https://github.com/RMI/pbtar/tree/main/src/data) directory in the [pbtar](https://github.com/RMI/pbtar) repo contains all of the data shown on the [Pathways-based transition assessment repository site](https://green-pebble-01f5d5c1e-main.westus2.6.azurestaticapps.net). There is an individual JSON file for each scenario/pathway containing all of the metadata for the associated scenario. The JSON files have a very strict, specific format that needs to be followed, which is defined by the JSON schema file in this repo at [pbtar_schema.json](https://github.com/RMI/pbtar/blob/main/pbtar_schema.json). To add a new scenario, a new JSON file in the correct format needs to be added to this repo in a pull request on `main`.

This README should be the definitive source of information about these JSON files and how to add them or modify them. As this repo is currently under heavy development, such details may change rapidly, and this README should be kept up to date with those changes as they happen. If you're developing in this repo, please remember to make appropriate changes to this README when relevant changes are made to the underlying code. If you're maintaining/modifying/adding the scenario data, please refer to the [live version of this README](https://github.com/RMI/pbtar/blob/main/src/data/README.md) on `main` for the most up-to-date details.

Each JSON file has a number of mandatory fields which must be included. Additionally, the structure, the data types, and in some cases the allowed values for a given key must be correct for things to work as expected. This repo has CI/CD setup to validate any new JSON added in a PR against the schema, as well as enforce code style requirements through a linter. Therefore, any new JSON added through a PR on main must pass all of the tests before being merged.

Currently, once a JSON file has been added to the repo, it still will not be included in the site's data unless it is also explicitly imported in the [scenariosData.ts](https://github.com/RMI/pbtar/blob/main/src/data/scenariosData.ts) script, so any PR that adds a new JSON should also include an edit to `scenariosData.ts` to include it unless intentionally left out of the site's data.

An example scenario metadata JSON file looks like...

```json
[
  {
    "id": "scenario-001",
    "name": "ZETI Net Zero Pathway",
    "description": "A comprehensive pathway for the global energy sector to reach net zero by 2050",
    "category": "IAM",
    "target_year": "2050",
    "target_temperature": "1.5C",
    "regions": ["Global"],
    "sectors": [
      "Power",
      "Oil & Gas",
      "Coal",
      "Renewables",
      "Transport",
      "Buildings",
      "Industrial"
    ],
    "publisher": "Zero Emissions Technology Institute",
    "published_date": "2021-05-18",
    "overview": "The ZETI Net Zero Pathway roadmap shows how the global energy sector can achieve net zero emissions by 2050. It is designed to examine what would need to happen to the energy system over the next 30 years to achieve net zero emissions by 2050. The pathway calls for rapid deployment of available technologies between now and 2030, with clean technologies in heavy industry and long-distance transport developed and brought to market in the 2030s. The pathway also requires innovation, international cooperation, and significant investment.",
    "expertRecommendation": "This scenario represents the most comprehensive global pathway to net zero and is highly recommended as a reference scenario for any climate transition assessment. It has excellent sectoral coverage and provides detailed milestones for different technologies and regions. However, analysts should note that it may be less detailed for specific regional considerations in Southeast Asia or other developing regions. Consider complementing this scenario with regional scenarios for a more complete assessment.",
    "dataSource": {
      "description": "The full scenario data is available from the ZETI website. Free summary data is available for download, while complete datasets require a ZETI data subscription.",
      "url": "https://www.zeti.org/reports/net-zero-pathway",
      "downloadAvailable": true
    }
  }
]
```

To facilitate creating a new JSON file in the appropriate format using R, we have created the following two functions to validate a R `<list>` against the schema in this repo, and to write a valid `<list>` to a JSON file. These functions can be copy-pasted to your R console and then they're available to use on any `<list>` you have in your environment. These functions require the following R packages to be installed in your environment: `jsonvalidate`, `jsonlite`, `dplyr`, `tidyr`, `stringr`, and `purrr`.

```r
validate_json <- function(json_obj, schema_url = NULL) {
  if (is.null(schema_url)) {
    schema_url <- "https://raw.githubusercontent.com/RMI/pbtar/refs/heads/main/pbtar_schema.json"
  }
  json_schema <- readr::read_file(file = schema_url)

  validation <-
    jsonvalidate::json_validate(
      json = jsonlite::toJSON(json_obj, auto_unbox = TRUE),
      schema = json_schema,
      verbose = TRUE,
      greedy = TRUE,
      engine = "ajv"
    )

  if (!validation) {
    errors <-
      attr(validation, "errors") |>
      dplyr::mutate(key = stringr::str_extract(instancePath, "[a-z]+")) |>
      tidyr::unnest(params) |>
      dplyr::mutate(allowedValues = purrr::map_chr(allowedValues, \(x) paste0(x, collapse = ", "))) |>
      dplyr::rename(input = data) |>
      dplyr::mutate(input = unlist(input)) |>
      dplyr::select(dplyr::any_of(c("input", "key", "message", "allowedValues")))
    return(errors)
  }
}

write_json <- function(json_obj, file) {
  validation <- validate_json(json_obj)
  if (!is.data.frame(validation)) {
    jsonlite::write_json(
      x = json_obj,
      path = file,
      auto_unbox = TRUE,
      pretty = TRUE
    )
    return(invisible())
  }
  validation
}
```

Once the above functions have been loaded in your R environment, a new `<list>` can be created, and then validated and exported as a JSON file using these functions like so...

```r
new_scenario_metadata <-
  list(
    list(
      id = "1",
      name = "ZETI Net Zero Pathway",
      description = "Text based description short",
      category = "IAM",
      target_year = "2050",
      target_temperature = "1.5C",
      regions = list("Global"),
      sectors = list("Power", "Oil & Gas", "Coal", "Renewables", "Transport", "Buildings", "Industrial"),
      publisher = "Zero Emissions Technology Institute",
      published_date = "2021-05-18",
      overview = "Text based overview long.",
      expertRecommendation = "Text based expert recommendation long.",
      dataSource = list(
        description = "Data source description.",
        url = "https://www.zeti.org/reports/net-zero-pathway",
        downloadAvailable = TRUE
      )
    )
  )

write_json(new_scenario_metadata, "test.json")
```

If the `<list>` is not valid, the functions will return a data frame with information about what was invalid, like so...

```r
new_scenario_metadata <-
  list(
    list(
      id = 1,
      name = list("ZETI Net Zero Pathway"),
      description = "Text based description short",
      category = "IAM",
      target_year = "2050",
      target_temperature = "1.5C",
      regions = "Global",
      sectors = list("Poer", "Oil&Gas", "Coal", "Renewables", "Transport", "Buildings", "Industrial"),
      publisher = "Zero Emissions Technology Institute",
      published_date = "2021-05-18",
      overview = "Text based overview long.",
      expertRecommendation = "Text based expert recommendation long.",
      dataSource = list(
        description = list("Data source description."),
        url = "https://www.zeti.org/reports/net-zero-pathway",
        downloadAvailable = 1
      )
    )
  )

write_json(new_scenario_metadata, "test.json")
#> # A tibble: 7 × 4
#>   input                    key     message                         allowedValues
#>   <chr>                    <chr>   <chr>                           <chr>
#> 1 1                        id      must be string                  ""
#> 2 ZETI Net Zero Pathway    name    must be string                  ""
#> 3 Global                   regions must be array                   ""
#> 4 Poer                     sectors must be equal to one of the al… "Agriculture…
#> 5 Oil&Gas                  sectors must be equal to one of the al… "Agriculture…
#> 6 Data source description. data    must be string                  ""
#> 7 1                        data    must be boolean                 ""
```
