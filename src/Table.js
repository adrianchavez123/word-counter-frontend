import React, { useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Title from "./components/Title";
import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from "@material-ui/icons/GetApp";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { CSVLink } from "react-csv";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(2),
  },
}));

export default function CustomTable({
  handleModify,
  handleDelete,
  title,
  headers = [],
  rows = [],
  showActions = false,
}) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.length >= 0 &&
              headers.map((thead) => (
                <TableCell key={thead}>{thead}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              const [id, ...values] = row;
              return (
                <TableRow key={`${id}-${Math.random()}`}>
                  {values.map((value) =>
                    value && typeof value === "object" ? (
                      <TableCell
                        key={`${id}-${value.id}-${value.text}-${Math.random()}`}
                      >
                        <Link component="button" onClick={value.onClick}>
                          {value.text}
                        </Link>
                      </TableCell>
                    ) : (
                      <TableCell key={`${id}-${value}-${Math.random()}`}>
                        {value}
                      </TableCell>
                    )
                  )}
                  {showActions ? (
                    <TableCell>
                      <label
                        htmlFor="icon-button-file"
                        style={{ marginRight: "1rem" }}
                      >
                        <IconButton
                          color="primary"
                          aria-label="modify an exercise"
                          component="span"
                          onClick={(e) => handleModify(id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          aria-label="delete an exercise"
                          component="span"
                          onClick={(e) => handleDelete(id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </label>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={rows.length}
        page={rows?.length ? page : 0}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div className={classes.seeMore}>
        <CSVLink
          data={[
            headers,
            ...rows.map((row) => {
              const [, ...r] = row;
              if (typeof r[0] === "object" && typeof r[1] === "object") {
                return [r[0].text, r[1].text, r[2]];
              } else if (typeof r[0] === "object" && typeof r[1] === "string") {
                return [r[0].text, r[1], r[2]];
              }
              return r;
            }),
          ]}
          filename={"exportar.csv"}
        >
          Exportar como csv
          <GetAppIcon
            style={{ fontSize: "1.2rem", position: "relative", top: ".4rem" }}
          />
        </CSVLink>
      </div>
    </React.Fragment>
  );
}
