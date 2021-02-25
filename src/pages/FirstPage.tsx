
import * as React from 'react';
import Table from '../components/table';
import * as Constants from "../utils/constants"
import GHDark from "../utils/GitHub-Mark-32px.png";
import GHLight from "../utils/GitHub-Mark-Light-32px.png";

interface Props {
}

interface State {
    showWinner: boolean
    lastRaceName: string,
    lastRaceDate: string,
    podium: any,
    loading: boolean,
    raceWinner: any,
    driverStandings: any,
    seasonString: string,
    roundString: string,
    constructorStandings: any
}

export default class FirstPage extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showWinner: false,
            lastRaceName: "",
            lastRaceDate: "",
            podium: [],
            loading: true,
            raceWinner: {},
            driverStandings: {},
            seasonString: "",
            roundString: "",
            constructorStandings: {}
        }
    }

    componentDidMount() {
        this.getDriverStandings()
    }

   getDriverStandings(){
        fetch(Constants.BaseURL + Constants.DriverStandingsSuffix)
              .then(res => res.json())
              .then (
                  (result) => {
                    var standingList = result.MRData.StandingsTable.StandingsLists[0]
                      this.setState({
                          seasonString: standingList.season,
                          roundString: standingList.round,
                          driverStandings: standingList.DriverStandings
                      }, () => {
                        this.getConstructorStandings()
                      })
                  },
                  (error) => {
                    console.log(error)
                    this.setState({loading: false})
                }
              )
            }

    getConstructorStandings(){
      fetch(Constants.BaseURL + Constants.ConstructorStandingsSuffix)
           .then(res => res.json())
           .then (
               (result) => {
                   var standingList = result.MRData.StandingsTable.StandingsLists[0]
                   this.setState({
                       constructorStandings: standingList.ConstructorStandings
                   }, () => {
                     this.getRaceResults()
                   })
               },
               (error) => {
                 console.log(error)
                 this.setState({loading: false})
               }
           )


 }

    getRaceResults(){
      var raceData: any;
      fetch(Constants.BaseURL + Constants.ResultsURLSuffix)
         .then(res => res.json())
         .then(
             (result) => {
                 raceData = result.MRData.RaceTable.Races[0]
                 this.setRaceData(raceData)
             },
             (error) => {
               console.log("ERROR")
               // Issue with api at end of seasons
                 var updatedURLString = this.state.seasonString + "/" + this.state.roundString + "/results.json"
                 console.log(updatedURLString)
                 fetch(Constants.BaseURL + updatedURLString)
                      .then(res => res.json())
                      .then(
                        (result) => {
                          raceData = result.MRData.RaceTable.Races[0]
                          this.setRaceData(raceData)
                        }
                      )
             }
         )
    }

    setRaceData(raceData: any){
      if (raceData !== undefined && raceData !== null) {
        this.setState({
            lastRaceName: raceData.raceName,
            lastRaceDate: raceData.date,
            podium: raceData.Results.slice(0, 3),
            loading: false,
            raceWinner: raceData.Results[0]
        });
      }
    }


   podiumDisplay = () => {
       var test = (
       <div>
           {this.state.podium.map((driver: any) => {
            return Object.keys(driver["Driver"]).map((value) => {
               return <p>{driver["Driver"][value]}</p>
            })
       })}
       </div>)

       return test
   }

   getRaceWinner(){
       var driverStats = this.state.raceWinner.Driver
        return(
            <div>
                <h1>{driverStats.givenName} {driverStats.familyName} - {this.state.raceWinner.Constructor.name}</h1>
            </div>
        )
   }

   getStandingsTitle(classification: string){
       var titleString = this.state.seasonString + " " + classification + " - Round " + this.state.roundString
       return titleString
   }


   getClassName(){
       return !this.state.showWinner ? "splashPage" :  this.state.podium[0].Constructor.constructorId
   }

   getGHIcon(){
       return Constants.LightIconConstructors.includes(this.getClassName()) ? GHLight : GHDark;
   }

    render() {
        return (
            <div className={this.getClassName()}>
                {this.state.loading ? <h2>Loading</h2> : !this.state.showWinner ? (
                    <div>
                        <h3>Who Won The {this.state.lastRaceName}?</h3>
                        <h3>On {this.state.lastRaceDate}</h3>
                        {!this.state.showWinner ? <button onClick={() => this.setState({showWinner: true})}>Find Out!</button> : null}

                    </div>
                ) : null
                }
                {this.state.showWinner ? (
                    <div>
                        <h3>Winner of The {this.state.lastRaceDate.slice(0, 4)} {this.state.lastRaceName}:</h3>
                        <u>{this.getRaceWinner()}</u>
                        <div className="row">
                            <div className="col">
                                <Table title={"Podium"} headers={["position", "driver", "team", "points", "time"]} data={this.state.podium} />
                            </div>
                            <div className="col">
                                <Table title={this.getStandingsTitle("Driver Standings")} headers={["position", "driver", "teamName", "points", "wins"]} data={this.state.driverStandings} />
                            </div>
                            <div className="col">
                                <Table title={this.getStandingsTitle("Constructor Standings")} headers={["position", "constructor", "points", "wins"]} data={this.state.constructorStandings} />
                            </div>
                        </div>
                        <a href={Constants.GitHubURL}>
                            <img src={this.getGHIcon()} alt={"GitHub"} />
                        </a>
                    </div>
                        ) : null}
            </div>
        )
    }
}
