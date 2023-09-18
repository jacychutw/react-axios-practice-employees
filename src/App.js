import { useState, useEffect } from 'react'
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { FaTrashAlt } from 'react-icons/fa'
import { FaEdit } from 'react-icons/fa'

function App() {
  const baseURL = "http://localhost:3000/employees";

  const [employees, setEmployees] = useState(null)
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [newEmployeePhone, setNewEmployeePhone] = useState('')
  const [newEmployeeProfession, setNewEmployeeProfession] = useState('')
  const [editEmployeeName, setEditEmployeeName] = useState('')
  const [editEmployeePhone, setEditEmployeePhone] = useState('')
  const [editEmployeeProfession, setEditEmployeeProfession] = useState('')
  const [editEmployeeID, setEditEmployeeID] = useState('')

  const [error, setError] = useState(null)

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const result = await axios.get(baseURL);
        setEmployees(result.data);
      } catch (error) {
        setError(error);
        if (error) return `Error: ${error.message}`;
      }
    }
    getEmployees();
  }, []);

  if (error) return `Error: ${error.message}`;
  if (!employees) return null;

  function handleSubmit(e) {
    e.preventDefault()

    if (newEmployeeName) {
      axios.post(baseURL, {
        id: employees[employees.length-1].id+1,
        name: newEmployeeName,
        phone: newEmployeePhone,
        profession: newEmployeeProfession
      })
      .then((response) => {
        setEmployees(currentEmployees => {
          return [
            ...currentEmployees,
            response.data
          ]
        })
      })
      .catch(error => {
        setError(error);
        if (error) return `Error: ${error.message}`;
      });
    }
    setNewEmployeeName('');
    setNewEmployeePhone('');
    setNewEmployeeProfession('');
  }

  function deleteEmployee(id) {
    axios.delete(`${baseURL}/${id}`)
    .then(() => {
      setEmployees(currentEmployees => {
        return currentEmployees.filter(employee => employee.id !== id)
      })
    })
    .catch(error => {
      setError(error);
      if (error) return `Error: ${error.message}`;
    });
  }

  function handleShow(id, name, phone, profession) {
    setEditEmployeeID(id);
    setEditEmployeeName(name);
    setEditEmployeePhone(phone);
    setEditEmployeeProfession(profession);
    setShow(true);
  }

  function handleEditSubmit(id) {
    if (editEmployeeName) {
      axios.put(`${baseURL}/${id}`, {
        id: id,
        name: editEmployeeName,
        phone: editEmployeePhone,
        profession: editEmployeeProfession
      })
      .then((response) => {
        console.log('edit data', response.data)
        window.location.reload();
      })
      .catch(error => {
        setError(error);
        if (error) return `Error: ${error.message}`;
      });
    }
    setEditEmployeeName('');
    setEditEmployeePhone('');
    setEditEmployeeProfession('');
    setShow(false);
  }

  return (
    <div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>ID: {editEmployeeID}</div>
          <label className="form-label mt-3">Name:</label>
          <input type="email" className="form-control" value={editEmployeeName} onChange={e => setEditEmployeeName(e.target.value)} placeholder="Name" />
          <label className="form-label mt-3">Phone:</label>
          <input type="text" className="form-control" value={editEmployeePhone} onChange={e => setEditEmployeePhone(e.target.value)} placeholder="Phone" />
          <label className="form-label mt-3">Profession:</label>
          <input type="text" className="form-control" value={editEmployeeProfession} onChange={e => setEditEmployeeProfession(e.target.value)} placeholder="Profession" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={() => handleEditSubmit(editEmployeeID)} >Submit</Button>
        </Modal.Footer>
      </Modal>

      <nav className="navbar bg-success-subtle">
        <div className="container-fluid">
          <div className="navbar-brand" style={{fontSize: "24px"}}>
            <img src="employee.png" alt="employee" width="32" height="32" className="d-inline-block align-text-top" />
            &nbsp;&nbsp;Employee Data
          </div>
        </div>
      </nav>

      <div className="container" style={{marginTop: "48px"}}>
        <div className="row">
          <div className="col">
            <input type="email" className="form-control" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} placeholder="Name" />
          </div>
          <div className="col">
            <input type="text" className="form-control" value={newEmployeePhone} onChange={e => setNewEmployeePhone(e.target.value)} placeholder="Phone" />
          </div>
          <div className="col">
            <input type="text" className="form-control" value={newEmployeeProfession} onChange={e => setNewEmployeeProfession(e.target.value)} placeholder="Profession" />
          </div>
          <div className="col">
           <button onClick={handleSubmit} type="button" className="btn btn-success w-100">Send</button>
           </div>
        </div>
      </div>

      <div style={{margin: "60px"}}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Phone</th>
              <th scope="col">Profession</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              return (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.profession}</td>
                  <td onClick={() => handleShow(employee.id, employee.name, employee.phone, employee.profession)}><FaEdit/></td>
                  <td onClick={() => deleteEmployee(employee.id)}><FaTrashAlt/></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
