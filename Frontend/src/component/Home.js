import React, { useState, useEffect } from "react";
import { Resizable } from "re-resizable";

const ResizableComponent = ({ width, height, backgroundColor, children }) => {
  const [size, setSize] = React.useState({ width, height });

  const onResize = (event, direction, ref, delta) => {
    setSize((prevSize) => ({
      width: prevSize.width + delta.width,
      height: prevSize.height + delta.height,
    }));
  };

  return (
    <Resizable
      defaultSize={{ width, height }}
      onResize={onResize}
      style={{
        border: "1px solid #ccc",
        margin: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor,
      }}
    >
      {children}
    </Resizable>
  );
};

const Home = () => {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4200/getuser")
      .then((result) => result.json())
      .then((resp) => {
        setData(resp.results);
        if (resp.results.length > 0) {
          setSelectedId(resp.results[0].id); // Store the ID of the first item in the data array
        } // Update to use resp.results
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  console.log("data", data, selectedId);
  const [size, setSize] = useState({ width: "750px", height: "300px" });

  const handleResize = (event, direction, ref, delta) => {
    setSize((prevSize) => ({
      width: prevSize.width + delta.width,
      height: prevSize.height + delta.height,
    }));
  };
  // add title
  const [title, settitle] = useState("");
  const handleSubmit = async () => {
    const requestData = { title }; // Construct request body

    console.log("Request Data:", requestData); // Log request data

    try {
      const response = await fetch("http://localhost:4200/windowuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(requestData), // Convert request data to JSON string
      });
      const result = await response.json();
      console.log("Response:", result); // Log response
      // Fetch updated data after successful submission
      fetch("http://localhost:4200/getuser")
        .then((result) => result.json())
        .then((resp) => {
          setData(resp.results); // Update to use resp.results
        });
    } catch (err) {
      console.error("Error submitting form:", err); // Log error
    }
  };
  // update title
  const [updateTitle, setUpdateTitle] = useState("");
  const handleUpdate = async () => {
    const requestData = { title: updateTitle };
    const url = `http://localhost:4200/windowuser/${selectedId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      console.log("Response:", result);

      // Fetch updated data after successful submission
      fetch("http://localhost:4200/getuser")
        .then((result) => result.json())
        .then((resp) => {
          setData(resp.results);
        });
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleUpdateModalOpen = (id, title) => {
    setSelectedId(id); // Set selectedId to the ID of the item to be updated
    setUpdateTitle(title); // Set updateTitle to the current title
  };
  // get count details
  const [data1, setData1] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4200/getcount")
      .then((result) => result.json())
      .then((resp) => {
        setData1(resp.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [data1]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // Set the height of the container to fill the viewport
        }}
      >
        <ResizableComponent
          width={200}
          height={300}
          backgroundColor="lightblue"
        >
          First Component
        </ResizableComponent>
        <ResizableComponent
          width={480}
          height={300}
          backgroundColor="lightgreen"
        >
          <div className="content">
            {/* Conditional rendering of data */}
            {data.length > 0 ? (
              <table>
                <tbody>
                  {data.map((item, index) => (
                    <>
                      <tr key={item.id}>
                        <td data-label="firstName">{item.title}</td>
                        <br />
                      </tr>
                      <tr>
                        {" "}
                        <td>
                          <button
                            className="btn btn-success"
                            data-toggle="modal"
                            data-target="#addModal"
                          >
                            Add
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-info"
                            data-toggle="modal"
                            data-target="#updateModal"
                            onClick={() =>
                              handleUpdateModalOpen(item.id, item.title)
                            }
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading...</p>
            )}

            {/* Modal code */}
            <div
              class="modal fade"
              id="addModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="addModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      Add title
                    </h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <form>
                      <input
                        type="description"
                        class="form-control"
                        placeholder="Enter title"
                        style={{ marginBottom: "16px;", height: "100px;" }}
                        onChange={(e) => {
                          settitle(e.target.value);
                        }}
                        value={title}
                      />
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-dismiss="modal"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* update modal */}
            <div
              class="modal fade"
              id="updateModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="updateModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      Update title
                    </h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <form>
                      <input
                        type="description"
                        class="form-control"
                        placeholder="Enter title"
                        style={{ marginBottom: "16px;", height: "100px;" }}
                        onChange={(e) => {
                          setUpdateTitle(e.target.value); // Update updateTitle state variable
                        }}
                        value={updateTitle}
                      />
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-dismiss="modal"
                      onClick={() => {
                        handleUpdate();
                      }}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResizableComponent>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // Set the height of the container to fill the viewport
        }}
      >
        <ResizableComponent
          width={700}
          height={300}
          backgroundColor="lightpink"
        >
          <div className="content">
            {/* Add your content here */}

            {data.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Add Count</th>&nbsp;&nbsp;&nbsp;
                    <th>Update Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data1.map((item, index) => (
                    <tr key={item.id}>
                      <td data-label="Add Count" className="add-count">
                        <center>{item.Add}</center>
                      </td>
                      &nbsp;&nbsp;&nbsp;
                      <td data-label="Update Count" className="update-count">
                        <center>{item.update}</center>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </ResizableComponent>
      </div>
    </div>
  );
};

export default Home;
