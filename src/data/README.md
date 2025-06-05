# Scenario metadata for the pbtar repo

The `src/data` directory in the pbtar repo contains all of the data shown on the Pathways-ba sed transition assessment repository site. There is an individual JSON file for each scenario/pathway containing all of the metadata for the associated scenario. The JSON files have a very strict, specific format that needs to be followed, which is defined by the JSON schema file in this repo at pbtar_schema.json. To add a new scenario, a new JSON file in the correct format needs to be added to this repo in a pull request on `main`.

This README should be the definitive source of information about these JSON files and how to add them or modify them. As this repo is currently under heavy development, such details may change rapidly, and this README should be kept up to date with those changes as they happen. If you're developing in this repo, please remember to make appropriate changes to this README when relevant changes are made to the underlying code. If you're mainting/modifying/adding the scenario data, please refer to the live version of this README on `main` for the most up to date details.

Each JSON file has a number of mandatory fields which must be included. Additionally, the structure, the data types, and in some cases the allowed values for a given key must be correct for things to work as expected. This repo has CI/CD setup to validate any new JSON added in a PR against the schema, as well as enforce code style requirements through a linter. Therefore, any new JSON added through a PR on main must pass all of the 


``` r
validate_json <- function(json_obj, shcema_url = NULL) {
  if (is.null(shcema_url)) {
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
      x = new_scenario_metadata,
      path = file,
      auto_unbox = TRUE,
      pretty = TRUE
    )
    return(invisible())
  }
  validation
}
```


``` r
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

``` r
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
