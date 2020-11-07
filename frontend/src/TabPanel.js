import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
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
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs({ gameRosters }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    console.log(gameRosters);

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                {Object.keys(gameRosters).map((game, i) => {
                    return <Tab label={game} {...a11yProps(i)} />;
                })}
            </Tabs>
            {Object.keys(gameRosters).map((game, i) => {
                return (
                    <TabPanel value={value} index={i}>
                        <TableContainer component={Paper}>
                            <Table key={`table-${game}-${i}`}>
                                <TableRow key={`table-header-${game}-${i}`}>
                                    <TableCell
                                        key={`table-header-player-${game}-${i}`}
                                    >
                                        Player
                                    </TableCell>
                                    <TableCell
                                        key={`table-header-role-${game}-${i}`}
                                    >
                                        Role
                                    </TableCell>
                                </TableRow>
                                {gameRosters[game].map((player, j) => (
                                    <TableRow
                                        key={`row-${player.id}-${game}-${i}-${j}`}
                                    >
                                        <TableCell
                                            key={`cell-id-${player.id}-${game}-${i}-${j}`}
                                        >
                                            <Typography>
                                                <Link
                                                    color="inherit"
                                                    to={`/players/${player.id}`}
                                                >
                                                    {player.id}
                                                </Link>
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            key={`cell-role-${player.id}-${game}-${i}-${j}`}
                                        >
                                            {player.extradata?.role ||
                                                "Unknown"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </TableContainer>
                    </TabPanel>
                );
            })}
        </div>
    );
}
