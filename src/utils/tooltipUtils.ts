import { PathwayType, Sector } from '../types';

export const pathwayTypeTooltips: Record<PathwayType, string> = {
  'Normative': 'Normative test tooltip TKTK',
  'Projection': 'Projection test tooltip TKTK',
  'Policy': 'Direct Policy test tooltip TKTK',
  'Exploration': 'Exploratory test tooltip TKTK'
};

export const sectorTooltips: Record<Sector, string> = {
  'Power': 'Power sector test tooltip TKTK',
  'Oil & Gas': 'Oil & Gas sector test tooltip TKTK',
  'Coal': 'Coal sector test tooltip TKTK',
  'Renewables': 'Renewables sector test tooltip TKTK',
  'Industrial': 'Industrial sector test tooltip TKTK',
  'Transport': 'Transport sector test tooltip TKTK',
  'Buildings': 'Buildings sector test tooltip TKTK',
  'Agriculture': 'Agriculture sector test tooltip TKTK',
  'N/A': 'Not applicable or no sector specified'
};

export const getPathwayTypeTooltip = (type: PathwayType): string => {
  return pathwayTypeTooltips[type] || 'No tooltip available';
};

export const getSectorTooltip = (sector: Sector): string => {
  return sectorTooltips[sector] || 'No tooltip available';
};
