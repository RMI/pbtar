from datetime import datetime
from sqlmodel import Field, SQLModel


class Organization(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    logo_url: str | None = Field(default=None, index=True)
    created_at: datetime = Field(
        default_factory=datetime.now(datetime.timezone.utc), index=True
    )
    updated_at: datetime = Field(
        default_factory=datetime.now(datetime.timezone.utc), index=True
    )


class Scenario(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: str | None = Field(default=None)
    usage: str | None = Field(default=None)
    time_horizon: str | None = Field(default=None)
    source: str | None = Field(default=None)
    nature: str | None = Field(default=None)
    target_temperature: str | None = Field(default=None)
    organization_id: int = Field(foreign_key="organizations.id")
    created_on: datetime = Field(
        default_factory=datetime.now(datetime.timezone.utc), index=True
    )
    updated_on: datetime = Field(
        default_factory=datetime.now(datetime.timezone.utc), index=True
    )


class GeographicCoverage(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)


class SectorCoverage(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
