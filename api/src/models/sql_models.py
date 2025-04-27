from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    Table,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


# Organizations Table
class Organization(Base):
    __tablename__ = "organizations"
    __table_args__ = {"schema": "pbtar"}

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    logo_url = Column(Text, nullable=True)
    created_on = Column(DateTime, default=func.current_timestamp(), nullable=False)
    updated_on = Column(
        DateTime,
        default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False,
    )

    # Relationships
    scenarios = relationship(
        "Scenario", back_populates="organization", cascade="all, delete-orphan"
    )


# Scenarios Table
class Scenario(Base):
    __tablename__ = "scenarios"
    __table_args__ = {"schema": "pbtar"}

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    usage = Column(String(50), nullable=True)
    time_horizon = Column(String(50), nullable=True)
    source = Column(String(255), nullable=True)
    nature = Column(String(50), nullable=True)
    target_temperature = Column(String(50), nullable=True)
    organization_id = Column(
        Integer, ForeignKey("pbtar.organizations.id", ondelete="CASCADE"), nullable=True
    )
    created_on = Column(DateTime, default=func.current_timestamp(), nullable=False)
    updated_on = Column(
        DateTime,
        default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False,
    )

    # Relationships
    organization = relationship("Organization", back_populates="scenarios")
    geographic_coverages = relationship(
        "GeographicCoverage",
        secondary="pbtar.scenario_geographic_coverage",
        back_populates="scenarios",
    )
    sector_coverages = relationship(
        "SectorCoverage",
        secondary="pbtar.scenario_sector_coverage",
        back_populates="scenarios",
    )


# Geographic Coverage Table
class GeographicCoverage(Base):
    __tablename__ = "geographic_coverage"
    __table_args__ = {"schema": "pbtar"}

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)

    # Relationships
    scenarios = relationship(
        "Scenario",
        secondary="pbtar.scenario_geographic_coverage",
        back_populates="geographic_coverages",
    )


# Sector Coverage Table
class SectorCoverage(Base):
    __tablename__ = "sector_coverage"
    __table_args__ = {"schema": "pbtar"}

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)

    # Relationships
    scenarios = relationship(
        "Scenario",
        secondary="pbtar.scenario_sector_coverage",
        back_populates="sector_coverages",
    )


# Junction Table for Scenario and Geographic Coverage
class ScenarioGeographicCoverage(Base):
    __tablename__ = "scenario_geographic_coverage"
    __table_args__ = {"schema": "pbtar"}

    scenario_id = Column(
        Integer, ForeignKey("pbtar.scenarios.id", ondelete="CASCADE"), primary_key=True
    )
    geographic_coverage_id = Column(
        Integer,
        ForeignKey("pbtar.geographic_coverage.id", ondelete="CASCADE"),
        primary_key=True,
    )


# Junction Table for Scenario and Sector Coverage
class ScenarioSectorCoverage(Base):
    __tablename__ = "scenario_sector_coverage"
    __table_args__ = {"schema": "pbtar"}

    scenario_id = Column(
        Integer, ForeignKey("pbtar.scenarios.id", ondelete="CASCADE"), primary_key=True
    )
    sector_coverage_id = Column(
        Integer,
        ForeignKey("pbtar.sector_coverage.id", ondelete="CASCADE"),
        primary_key=True,
    )
