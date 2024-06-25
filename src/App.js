import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('address');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [id, setId] = useState(0);
  const [isUpdate, setisUpdate] = useState(false);

  useEffect(() => {
    localStorage.setItem("address", JSON.stringify(data));
  }, [data]);

  const handleEdit = (id) => {
    const dt = data.filter(item => item.id === id);
    if (dt !== undefined) {
      setisUpdate(true)
      setId(id);
      setStreetName(dt[0].streetName);
      setCity(dt[0].city);
      setState(dt[0].state);
      setZipCode(dt[0].zipCode);
    }
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this address?")) {
      const dt = data.filter(item => item.id !== id);
      setData(dt);
    }
  }

  const handleSave = (e) => {
    let error = '';
    if (streetName.trim() === '')
      error += "Please enter street name.\n";
    if (city.trim() === '')
      error += "Please enter city name.\n";
    if (state.trim() === '')
      error += "Please enter state.\n";
    if (zipCode.trim() === '') {
      error += "Please enter Zip Code.\n";
    } else if (isNaN(Number(zipCode))) {
      error += "Invalid Zip Code.\n";
    }
    else if (!/^\d{6}$/.test(zipCode) || zipCode < '000000' || zipCode > '800000') {
      error += "Invalid Zip Code.\n";
    }

    if (error === '') {
      e.preventDefault();
      const dt = [...data];
      const isDuplicate = data.some(item => (
        item.streetName === streetName &&
        item.city === city &&
        item.state === state &&
        item.zipCode === zipCode
      ));
      if (isDuplicate) {
        alert('Duplicate entry is not allowed.');
        return;
      }

      const newObject = {
        id: Date.now(),
        streetName: streetName,
        city: city,
        state: state,
        zipCode: zipCode
      };

      setData([...dt, newObject]);
      handleClear();

    }
    else {
      alert(error)
    }

  }
  const handleUpdate = () => {
    const index = data.map((item) => {
      return item.id
    }).indexOf(id);
    const dt = [...data];
    dt[index].streetName = streetName;
    dt[index].city = city;
    dt[index].state = state;
    dt[index].zipCode = zipCode;

    setData(dt);
    handleClear();
  }

  const handleClear = () => {
    setId(0);
    setStreetName('');
    setCity('');
    setState('');
    setZipCode('');
    setisUpdate(false);
  }

  return (
    <div className="App" >
      <div style={{ background: '#1c243b', color: 'white', margin: '0px', padding: '15px',fontFamily:'times new roman' }}>
        <h1>ADDRESS UPDATER</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '15px', background: '#1c243b', fontFamily:'times new roman', fontSize:'20px' }}>
        <div style={{ margin: "10px" }}>
          <label style={{ color: 'white' }}> Street Name:
            <input style={{ margin: "5px" }} type="text" placeholder='Enter Street Name' onChange={(e) => setStreetName(e.target.value)} value={streetName} />
          </label>
        </div><hr />
        <div style={{ margin: "10px" }}>
          <label style={{ color: 'white' }}> City:
            <input style={{ margin: "5px" }} type="text" placeholder='Enter City' onChange={(e) => setCity(e.target.value)} value={city} />
          </label>
        </div>
        <div style={{ margin: "10px" }}>
          <label style={{ color: 'white' }}> State:
            <input style={{ margin: "5px" }} type="text" placeholder='Enter State' onChange={(e) => setState(e.target.value)} value={state} />
          </label>
        </div>
        <div style={{ margin: "10px" }}>
          <label style={{ color: 'white' }}> Zip Code:
            <input style={{ margin: "5px" }} type="text" placeholder='Enter Zip Code' onChange={(e) => setZipCode(e.target.value)} value={zipCode} />
          </label>
        </div>
        <div >
          {
            !isUpdate ?
              <button className='btn btn-primary' style={{ margin: '10px' }} onClick={(e) => handleSave(e)}>Save</button>
              :
              <button className='btn btn-primary' style={{ margin: '10px' }} onClick={() => handleUpdate()}>Update</button>
          }
          <button className='btn btn-danger' onClick={() => handleClear()}>Clear</button>&nbsp;
        </div>
      </div>

      <table className='table table-hover' style={{ background: 'darkblue', color: 'white', fontFamily:'times new roman', fontSize:'20px' }}>
        <thead>
          <tr>
            <td>Sr.No</td>
            <td>Street Name</td>
            <td>City</td>
            <td>State</td>
            <td>Zip code</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {
            data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.streetName}</td>
                  <td>{item.city}</td>
                  <td>{item.state}</td>
                  <td>{item.zipCode}</td>
                  <td>
                    <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button>&nbsp;
                    <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>&nbsp;
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
