interface INflEndpointSeasonResponse {
  type: number
  year: number
}

interface INflEndpointWeekResponse {
  number: number
}

interface INflCompetitionType {
  id: number
  abbreviation: string
}

interface INflCompetitionVenueAddress {
  city: string
  state: string
}

interface INflCompetitionVenue {
  id: string
  fullName: string
  address: INflCompetitionVenueAddress
  capacity: number
  indoor: boolean
}

interface INflTeamResponse {
  id: string
  uid: string
  location: string
  name: string
  abbreviation: string
  displayName: string
  shortDisplayName: string
  color: string
  alternateColor: string
  isActive: boolean
  venue: {
    id: number
  }
  logo: string
  score: number
}

interface INflCompetitor {
  id: string
  uid: string
  type: string
  order: number
  homeAway: string
  team: INflTeamResponse
}

interface INflEndpointCompetitionResponse {
  id: string
  uid: string
  date: Date
  attendance: number
  type: INflCompetitionType
  timeValid: boolean
  neutralSite: boolean
  conferenceCompetition: boolean
  recent: boolean
  venue: INflCompetitionVenue
  competitors: INflCompetitor[]
  odds: INflEndpointOddsResponse[]
}

interface INflEndpointStatusTypeResponse {
  id: number
  name: string
  state: string
  completed: boolean
  description: string
  detail: string
  shortDetail: string
}

interface INflEndpointStatusResponse {
  clock: number
  displayClock: string
  period: number
  type: INflEndpointStatusTypeResponse
}

interface INflEndpointOddsResponse {
  details: string
  overUnder: number
}

interface INflEndpointEventResponse {
  id: string
  uid: string
  date: Date
  name: string
  shortName: string
  season: INflEndpointSeasonResponse
  competitions: INflEndpointCompetitionResponse[]
  status: INflEndpointStatusResponse
}

export interface INflEndpointResponse {
  leagues: any
  season: INflEndpointSeasonResponse
  week: INflEndpointWeekResponse
  events: INflEndpointEventResponse[]
}
