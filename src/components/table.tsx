import * as React from 'react';

interface Props {
    headers: string[],
    data: any,
    title: string
}


export default class Table extends React.Component<Props> {

    constructor(props: Props){
        super(props);
        this.getData = this.getData.bind(this)
    }

    getHeaders(){
        return (
            <tr>
                {this.props.headers.map((header) => {
                    var titleHeader = ""
                    for (var i = 0; i < header.length; i++){
                        if (i === 0) {
                            titleHeader = titleHeader.concat(header[i].toUpperCase())
                        } else if (header[i] === header[i].toUpperCase()) {
                            titleHeader = titleHeader.concat(" ")
                            titleHeader = titleHeader.concat(header[i])
                        } else {
                            titleHeader = titleHeader.concat(header[i])
                        }
                    }
                    return <th key={header}>{titleHeader}</th>
                })}
            </tr>
        )
    }

    getData(){
        return (
        <tbody>
            {this.props.data.map((item: any) => {
                    var idKey = item["Driver"] ? item["Driver"]["driverId"] : item["Constructor"]["constructorId"]
                    return (<tr key={idKey + this.props.title}> 
                        { this.props.headers.map((header: any, value) => {
                            if (header === "constructor"){
                                return(<td key={header + idKey + this.props.title}>{item["Constructor"]["name"]} </td>)
                            } else if (header === "driver"){
                                return(<td key={header + idKey + this.props.title}>{item["Driver"]["givenName"]} {item["Driver"]["familyName"]}</td>)
                            } else if (header === "team") {
                                return(<td key={header + idKey + this.props.title}>{item["Constructor"]["name"]}</td>)
                            } else if (header === "time"){
                                return(<td key={header + idKey + this.props.title}>{item["Time"][header]}</td>)
                            } else if (header === "teamName"){
                                return(<td key={header + idKey + this.props.title}>{item["Constructors"][0]["name"]}</td>)
                            } else if (item[header]){
                                return (<td key={header + idKey + this.props.title}>{item[header]}</td>)
                            }
                            return null
                        })}
                        </tr>)
        
                })}
        </tbody>
                
        )

    }

    render() {
        return (
            <div >
                <h2>{this.props.title}</h2>
                <table className="table">
                    <thead>
                        {this.getHeaders()}
                    </thead>
                        {this.getData()}
                </table>
            </div>
        )
    }
}

