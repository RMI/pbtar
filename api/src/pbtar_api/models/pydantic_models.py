from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Organization Pydantic Model
class OrganizationBase(BaseModel):
    name: str
    logo_url: Optional[str] = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationResponse(OrganizationBase):
    id: int
    created_on: datetime
    updated_on: datetime

    class Config:
        orm_mode = True


# Scenario Pydantic Model
class ScenarioBase(BaseModel):
    name: str
    description: Optional[str] = None
    usage: Optional[str] = None
    time_horizon: Optional[str] = None
    source: Optional[str] = None
    nature: Optional[str] = None
    target_temperature: Optional[str] = None
    organization_id: Optional[int] = None


class ScenarioCreate(ScenarioBase):
    pass


class ScenarioResponse(ScenarioBase):
    id: int
    created_on: datetime
    updated_on: datetime

    class Config:
        orm_mode = True


# Geographic Coverage Pydantic Model
class GeographicCoverageBase(BaseModel):
    name: str


class GeographicCoverageCreate(GeographicCoverageBase):
    pass


class GeographicCoverageResponse(GeographicCoverageBase):
    id: int

    class Config:
        orm_mode = True


# Sector Coverage Pydantic Model
class SectorCoverageBase(BaseModel):
    name: str


class SectorCoverageCreate(SectorCoverageBase):
    pass


class SectorCoverageResponse(SectorCoverageBase):
    id: int

    class Config:
        orm_mode = True


# Scenario Geographic Coverage Pydantic Model
class ScenarioGeographicCoverageBase(BaseModel):
    scenario_id: int
    geographic_coverage_id: int


class ScenarioGeographicCoverageResponse(ScenarioGeographicCoverageBase):
    class Config:
        orm_mode = True


# Scenario Sector Coverage Pydantic Model
class ScenarioSectorCoverageBase(BaseModel):
    scenario_id: int
    sector_coverage_id: int


class ScenarioSectorCoverageResponse(ScenarioSectorCoverageBase):
    class Config:
        orm_mode = True
