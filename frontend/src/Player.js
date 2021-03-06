import React from "react";
import Chart from "react-google-charts";
import { Typography, Grid, TableBody } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    Paper,
    Link,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TableHead,
} from "@material-ui/core";
import * as Constants from "./Constants";
import { Link as RouterLink } from "react-router-dom";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
}))(TableCell);

const styles = {
    subheading: {
        marginTop: 24,
        marginBottom: 12,
    },
    heading: {
        marginTop: 24,
    },
};

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: [],
            currTeam: null,
            teammates: [],
            queried: false,
        };
    }

    componentDidMount() {
        Constants.GAMES.forEach((game) => {
            let params = new FormData();
            params.append("wiki", game);
            params.append("apikey", Constants.LIQUID_API_KEY);
            params.append("limit", Constants.MAXIMUM_QUERY_LIMIT);
            params.append(
                "conditions",
                `[[player::${this.props.match.params.player}]]`
            );

            fetch(
                `${Constants.LIQUID_API_URL}${Constants.TRANSFER_LIST_ENDPOINT}`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams(params),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    let currInfo = this.state.info;

                    this.setState({
                        info: [...currInfo, ...data.result],
                    });
                })
                .catch((err) => console.log(err));

            params.set(
                "conditions",
                `[[id::${this.props.match.params.player}]]`
            );
            fetch(
                `${Constants.LIQUID_API_URL}${Constants.PLAYER_LIST_ENDPOINT}`,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams(params),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.result.length > 0) {
                        this.setState({
                            currTeam: data.result[0]["team"],
                        });

                        if (data.result[0]["team"] !== "") {
                            params.set(
                                "conditions",
                                `[[team::${data.result[0]["team"]}]] AND [[id::!${this.props.match.params.player}]]`
                            );
                            fetch(
                                `${Constants.LIQUID_API_URL}${Constants.PLAYER_LIST_ENDPOINT}`,
                                {
                                    method: "POST",
                                    mode: "cors",
                                    headers: {
                                        "Content-Type":
                                            "application/x-www-form-urlencoded",
                                    },
                                    body: new URLSearchParams(params),
                                }
                            )
                                .then((response) => response.json())
                                .then((data) => {
                                    this.setState({
                                        teammates: data.result,
                                    });
                                })
                                .catch((err) => console.log(err));
                        }
                    }
                })
                .catch((err) => console.log(err));
        });

        this.setState({
            queried: true,
        });
    }

    render = () => {
        if (!this.state.queried) return null;

        let { info, teammates } = this.state;

        let playerInfo = info
            .filter((x) => {
                return x.toteam !== "";
            })
            .sort((a, b) => {
                return Date.parse(b.date) - Date.parse(a.date);
            });

        let timelineData = [];
        timelineData.push([
            { type: "string", id: "Game" },
            { type: "string", id: "Team Name" },
            { type: "date", id: "Start" },
            { type: "date", id: "End" },
        ]);

        let currDate = Date.now();
        for (var entry of playerInfo) {
            if (entry.toteam === "") {
                timelineData.push([
                    "N/A",
                    "(No Team)",
                    new Date(Date.parse(entry.date)),
                    currDate,
                ]);
            } else {
                timelineData.push([
                    `${Constants.GAMES_PRETTY[entry.wiki]}`,
                    entry.toteam,
                    new Date(Date.parse(entry.date)),
                    currDate,
                ]);
            }

            currDate = new Date(Date.parse(entry.date));
        }

        const props = this.props;

        let primaryColor = this.props.theme.palette.text.primary;
        let backgroundColor = this.props.theme.palette.background;

        const { classes } = props;

        return (
            <React.Fragment>
                <Grid
                    className={classes.heading}
                    style={{ justifyContent: "center" }}
                    container
                >
                    {this.state.currTeam ? (
                        <RouterLink
                            to={`/organizations/${this.state.currTeam}`}
                        >
                            <img
                                src={`${Constants.BACKEND_URL}${Constants.LOGOS_ENDPOINT}${this.state.currTeam}`}
                                alt={`${this.state.currTeam} Logo`}
                                width={90}
                                height={110}
                                style={{ marginRight: 20 }}
                            />
                        </RouterLink>
                    ) : null}
                    <Typography variant="h1" align="left">
                        {this.props.match.params.player}
                    </Typography>
                </Grid>

                <Typography
                    variant="h4"
                    align="center"
                    className={classes.subheading}
                >
                    Transfer Activity
                </Typography>
                {timelineData.length === 1 ? (
                    <Typography align="center" className={classes.subheading}>
                        No Data Available
                    </Typography>
                ) : (
                    <Chart
                        width={"500px"}
                        height={"300px"}
                        style={{ marginLeft: "auto", marginRight: "auto" }}
                        chartType="Timeline"
                        loader={<div>Loading Chart</div>}
                        data={timelineData}
                        options={{
                            timeline: {
                                groupByRowLabel: false,
                                rowLabelStyle: {
                                    color: primaryColor,
                                },
                                barLabelStyle: {
                                    color: primaryColor,
                                },
                                showBarLabels: false,
                            },
                            backgroundColor: backgroundColor.paper,
                        }}
                        chartEvents={[
                            {
                                eventName: "ready",
                                callback: () => {
                                    var labels = document.getElementsByTagName(
                                        "text"
                                    );
                                    Array.prototype.forEach.call(
                                        labels,
                                        function (label) {
                                            if (
                                                label.getAttribute(
                                                    "text-anchor"
                                                ) === "middle"
                                            ) {
                                                label.setAttribute(
                                                    "fill",
                                                    primaryColor
                                                );
                                            }
                                        }
                                    );
                                },
                            },
                            {
                                eventName: "select",
                                callback({ chartWrapper }) {
                                    const name =
                                        playerInfo[
                                            chartWrapper
                                                .getChart()
                                                .getSelection()[0].row
                                        ].toteam;
                                    if (name) {
                                        props.history.push(
                                            `/organizations/${name}`
                                        );
                                    }
                                },
                            },
                        ]}
                    />
                )}

                <Typography
                    variant="h4"
                    align="center"
                    className={classes.subheading}
                >
                    Current Teammates on{" "}
                    <Link
                        color="inherit"
                        component={RouterLink}
                        to={`/organizations/${this.state.currTeam}`}
                    >
                        {this.state.currTeam}
                    </Link>
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell key={`table-header-player`}>
                                    Player
                                </StyledTableCell>
                                <StyledTableCell key={`table-header-role`}>
                                    Role
                                </StyledTableCell>
                                <StyledTableCell
                                    key={`table-header-nationality`}
                                >
                                    Nationality
                                </StyledTableCell>
                                <StyledTableCell key={`table-header-name`}>
                                    Name
                                </StyledTableCell>
                                <StyledTableCell key={`table-header-age`}>
                                    Age
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teammates.map((player, i) => (
                                <TableRow key={`row-${player.id}-${i}`}>
                                    <TableCell
                                        key={`cell-id-${player.id}-${i}`}
                                    >
                                        <Typography style={{ fontSize: 14 }}>
                                            <Link
                                                color="inherit"
                                                to={`/players/${player.id}`}
                                                component={RouterLink}
                                            >
                                                {player.id}
                                            </Link>
                                        </Typography>
                                    </TableCell>
                                    <TableCell key={`cell-role-${player.id}`}>
                                        {player.extradata?.role || "Unknown"}
                                    </TableCell>
                                    <TableCell
                                        key={`cell-nationality-${player.id}`}
                                    >
                                        {player.nationality || "Unknown"}
                                    </TableCell>
                                    <TableCell key={`cell-name-${player.id}`}>
                                        {player.romanizedname ||
                                            player.name ||
                                            "Unknown"}
                                    </TableCell>
                                    <TableCell key={`cell-age-${player.id}`}>
                                        {new Date(
                                            +new Date() -
                                                +new Date(player.birthdate)
                                        ).getFullYear() - 1970}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </React.Fragment>
        );
    };
}

export default withStyles(styles)(withRouter(withTheme(Player)));
