import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
    Paper,
    Link,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TableHead,
    TableBody,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
}))(TableCell);

const OtherStyledTableCell = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
    },
}))(TableCell);

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tab-roster-${index}`}
            aria-labelledby={`tab-roster-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {},
    tabs: {},
}));

export default function VerticalTabs({ gameRosters }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Rosters"
                className={classes.tabs}
                centered
            >
                {Object.keys(gameRosters).map((game, i) => {
                    return (
                        <Tab
                            key={`tab-roster-${game}`}
                            label={game}
                            {...a11yProps(i)}
                        />
                    );
                })}
            </Tabs>
            {Object.keys(gameRosters).map((game, i) => {
                return (
                    <TabPanel
                        key={`tab-panel-${game}-${i}`}
                        value={value}
                        index={i}
                        style={{ width: "100%" }}
                    >
                        <TableContainer
                            key={`table-container-${game}-${i}`}
                            component={Paper}
                        >
                            <Table
                                key={`table-${game}-${i}`}
                                style={{ width: "100%" }}
                            >
                                <TableHead key={`table-header-${game}-${i}`}>
                                    <TableRow>
                                        <StyledTableCell
                                            key={`table-header-player-${game}-${i}`}
                                        >
                                            Player
                                        </StyledTableCell>
                                        <StyledTableCell
                                            key={`table-header-role-${game}-${i}`}
                                        >
                                            Role
                                        </StyledTableCell>
                                        <StyledTableCell
                                            key={`table-header-status-${game}-${i}`}
                                        >
                                            Status
                                        </StyledTableCell>
                                        <StyledTableCell
                                            key={`table-header-nationality-${game}-${i}`}
                                        >
                                            Nationality
                                        </StyledTableCell>
                                        <StyledTableCell
                                            key={`table-header-name-${game}-${i}`}
                                        >
                                            Name
                                        </StyledTableCell>
                                        <StyledTableCell
                                            key={`table-header-age-${game}-${i}`}
                                        >
                                            Age
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {gameRosters[game].map((player, j) => (
                                        <TableRow
                                            key={`row-${player.id}-${game}-${i}-${j}`}
                                        >
                                            <OtherStyledTableCell
                                                key={`cell-id-${player.id}-${game}-${i}-${j}`}
                                            >
                                                <Typography>
                                                    <Link
                                                        color="inherit"
                                                        to={`/players/${player.id}`}
                                                        style={{
                                                            fontSize: 14,
                                                        }}
                                                        component={RouterLink}
                                                    >
                                                        {player.id}
                                                    </Link>
                                                </Typography>
                                            </OtherStyledTableCell>
                                            <OtherStyledTableCell
                                                key={`cell-role-${player.id}-${game}-${i}-${j}`}
                                            >
                                                {player.extradata?.role ||
                                                    "Unknown"}
                                            </OtherStyledTableCell>
                                            <OtherStyledTableCell
                                                key={`cell-status-${player.id}-${game}-${i}-${j}`}
                                            >
                                                {player.status || "Unknown"}
                                            </OtherStyledTableCell>
                                            <OtherStyledTableCell
                                                key={`cell-nationality-${player.id}-${game}-${i}-${j}`}
                                            >
                                                {player.nationality ||
                                                    "Unknown"}
                                            </OtherStyledTableCell>
                                            <OtherStyledTableCell
                                                key={`cell-name-${player.id}-${game}-${i}-${j}`}
                                            >
                                                {player.romanizedname ||
                                                    player.name ||
                                                    "Unknown"}
                                            </OtherStyledTableCell>
                                            <OtherStyledTableCell
                                                key={`cell-age-${player.id}-${game}-${i}-${j}`}
                                            >
                                                {new Date(
                                                    +new Date() -
                                                        +new Date(
                                                            player.birthdate
                                                        )
                                                ).getFullYear() - 1970}
                                            </OtherStyledTableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                );
            })}
        </Paper>
    );
}
