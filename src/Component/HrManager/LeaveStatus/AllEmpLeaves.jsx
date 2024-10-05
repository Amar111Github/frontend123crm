import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import Pagination from "../../../Utils/Pagination";
import { RingLoader } from "react-spinners";
import profileImg from "../../../img/profile.jpg";
import BASE_URL from "../../../Pages/config/config";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";

const AllEmpLeaves = (props) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/getAllLeave`, {
        headers: {
          authorization: localStorage.getItem("token") || "",
        },
      })
      .then((response) => {
        const leaveApplicationHRObj = response.data.filter((val) => {
          return val.Account === 3;
        });
        setLoading(false);

        const rowDataT = leaveApplicationHRObj.map((data) =>
          data.profile !== null
            ? {
                empID: data.empID,
                Name: data.FirstName + " " + data.LastName,
                Leavetype: data.Leavetype,
                sickLeave: data.sickLeave,
                paidLeave: data.paidLeave,
                casualLeave: data.casualLeave,
                paternityLeave: data.paternityLeave,
                maternityLeave: data.maternityLeave,
                profilePic: data.profile.image_url,
              }
            : {
                empID: data.empID,
                Name: data.FirstName + " " + data.LastName,
                Leavetype: data.Leavetype,
                sickLeave: data.sickLeave,
                paidLeave: data.paidLeave,
                casualLeave: data.casualLeave,
                paternityLeave: data.paternityLeave,
                maternityLeave: data.maternityLeave,
                profilePic: null,
              }
        );

        setRowData(rowDataT);
        setFilteredData(rowDataT);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const filtered = rowData.filter((item) =>
      item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery]);

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center py-3">
        <h6
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--secondaryDashMenuColor)",
          }}
          className="fw-bold my-auto"
        >
          Leaves Balance
        </h6>
        <div className="searchholder p-0 d-flex position-relative">
          <input
            style={{ height: "100%", width: "100%", paddingLeft: "15%" }}
            className="form-control border rounded-0"
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div id="clear-both" />
      {!loading ? (
        <div>
          <table className="table" style={{ fontSize: ".9rem" }}>
            <thead>
              <tr>
                <th style={rowHeadStyle(darkMode)}>Profile</th>
                <th style={rowHeadStyle(darkMode)}>Employee Name</th>
                <th style={rowHeadStyle(darkMode)}>Emp ID</th>

                <th style={rowHeadStyle(darkMode)}>Sick Leave</th>
                <th style={rowHeadStyle(darkMode)}>Paid Leave</th>
                <th style={rowHeadStyle(darkMode)}>Casual Leave</th>
                <th style={rowHeadStyle(darkMode)}>Paternity Leave</th>
                <th style={rowHeadStyle(darkMode)}>Maternity Leave</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((data, index) => (
                <tr key={index}>
                  <td style={rowBodyStyle(darkMode)}>
                    <img
                      src={data.profilePic || profileImg}
                      alt="Profile"
                      style={{
                        height: "2rem",
                        width: "2rem",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td style={rowBodyStyle(darkMode)}>{data.Name}</td>
                  <td style={rowBodyStyle(darkMode)}>{data.empID}</td>
                  <td style={rowBodyStyle(darkMode)}>{data.sickLeave}</td>
                  <td style={rowBodyStyle(darkMode)}>{data.paidLeave}</td>
                  <td style={rowBodyStyle(darkMode)}>{data.casualLeave}</td>
                  <td style={rowBodyStyle(darkMode)}>{data.paternityLeave}</td>
                  <td style={rowBodyStyle(darkMode)}>{data.maternityLeave}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            pageNumbers={pageNumbers}
            handlePaginationPrev={handlePaginationPrev}
            handlePaginationNext={handlePaginationNext}
            setCurrentPage={setCurrentPage}
            filteredDataLength={filteredData.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <div id="loading-bar">
          <RingLoader size={50} color="#0000ff" loading={true} />
        </div>
      )}
    </div>
  );
};

export default AllEmpLeaves;
