import { Fragment, useEffect, useState } from "react";
import axios from "axios";

const Chatgpt = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState([]);
    const [table, setTable] = useState([]);
    const [editrow, setEditrow] = useState(-1);

    const [data, setData] = useState({
        age: "",
        gender: "male",
        level: "",
        mgroup: "",
        time: "",
        gplan: false,
        walk: false,
        swim: false,
        yoga: false,
        meditate: false,
    });

    const [updatedData, setUpdatedData] = useState([{
        Index: "",
        Exercise: "",
        Sets: "",
        Reps: "",
    }]);

    // Get data from Local storage
    const getLocalPlan = () => {
        let previousplan = localStorage.getItem('workoutPlan');
        if (previousplan) {
            setTable(JSON.parse(localStorage.getItem('workoutPlan')));
        } else {
            return [];
        }
    }

    // Add data to local storage
    const SaveExercise = (response) => {
        if (table) {
            localStorage.setItem('workoutPlan', JSON.stringify(table))
        }
    };

    //Move Data to final array where we can do processing like delete and add/edit rows
    useEffect(() => {
        setTable(response);
    }, [response]);

    const HTTP = "http://localhost:8020/chat"

    //After clicking on Submit button, Prompt message will be created here based on input
    const handleSubmit = (e) => {
        e.preventDefault();
        const plan = data.gplan === true ? 'general' : '';
        const walk = data.walk === true ? 'walking' : '';
        const swim = data.swim === true ? 'swimming' : '';
        const yoga = data.yoga === true ? 'yoga' : '';
        const meditate = data.meditate === true ? 'meditation' : '';
        if (data.level && data.time && data.age && data.gender && data.mgroup) {
            setPrompt(`Create ${data.level} level ${data.time} hours of ${plan} workout plan for
                     ${data.age} years old ${data.gender} for ${data.mgroup} muscles
                     in json format of array with index , name of exercise reps and sets only also add 
                     exercise like ${walk}  ${swim}  ${yoga} ${meditate}`);
        };
        setEditrow(-1);  //Initialize edit row value during each submit operation
    };

    //reading each input element value of form and store it in state called data
    function handleChange(e) {
        console.log(e.target);
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setData((data) => {
            const updatedData = { ...data, [name]: value }
            return updatedData
        })
    };

    //To Delete table entry
    function handleDelete(index) {
        const newList = table.filter(li => li.index !== index);
        setTable(newList);
    }

    //Just to get index of table entry, which choosed to edit, by clicking on edit button
    function handleEdit(index) {
        setEditrow(index);
    }

    // //To Update edited value in table array
    // function handleUpdate(e) {

    // }

    // function Print({ curUser }) {
    //     <tr key={curUser.index}>
    //         <td>{curUser.index}</td>
    //         <td>{curUser.name}</td>
    //         <td>{curUser.sets}</td>
    //         <td>{curUser.reps}</td>
    //         <td>
    //             <button className="edit" onClick={() => handleEdit(curUser.index)}>Edit</button>
    //             <button className="delete" onClick={() => handleDelete(curUser.index)}>Delete</button>
    //         </td>
    //     </tr>
    // }

    //Edit Functionality for table row
    // function Edit({ curUser, table, setTable }) {
    function handleEditcolumn(e) {
        const newList = table.map(li =>
        (
            li.index === editrow ?
                { ...li, [e.target.name]: e.target.value }
                :
                li
        )
        )
        setTable(newList);
    }
    // return (
    //     <tr >
    //         <td><input type="text" name="name" onChange={handleEdit} value={curUser.name}></input></td>
    //         <td><input type="text" name="sets" onChange={handleEdit} value={curUser.sets}></input></td>
    //         <td><input type="text" name="reps" onChange={handleEdit} value={curUser.reps}></input></td>
    //         <td><button type="submit">Update</button></td>
    //     </tr>
    // )
    // }

    //React is async no it doesn't update immediately, 
    //We need to use useffect to update or re-render page immediately
    useEffect(() => {
        if (prompt) {
            axios.post(`${HTTP}`, { prompt })
                .then((res) => setResponse(res.data))
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [prompt]);

    return (
        <div className="body">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="main">
                        <div className="form">
                            <div>
                                <label>Age </label>
                                <input type="number" name='age' onChange={handleChange} />
                            </div>

                            <div>
                                <label>Gender</label>
                                <div>
                                    <label>Male </label>
                                    <input type="radio" value='male' checked={data.gender === 'male'} name='gender' onChange={handleChange} />
                                    <label> Female </label>
                                    <input type="radio" value='female' checked={data.gender === 'female'} name='gender' onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <label>Fitness Level </label>
                                <select name='level' onChange={handleChange}>
                                    <option value=""></option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label>Target Muscle Group </label>
                                <select name='mgroup' onChange={handleChange}>
                                    <option value=""></option>
                                    <option value="chest">Chest</option>
                                    <option value="back">Back</option>
                                    <option value="arms">Arms</option>
                                    <option value="legs">Legs</option>
                                    <option value="shoulders">Shoulders</option>
                                </select>
                            </div>

                            <div>
                                <label> Walking </label>
                                <input type="checkbox" name='walk' checked={data.walk} onChange={handleChange} />
                                <label> Swimming </label>
                                <input type="checkbox" name='swim' checked={data.swim} onChange={handleChange} />
                            </div>
                            <div>
                                <label> Yoga </label>
                                <input type="checkbox" name='yoga' checked={data.yoga} onChange={handleChange} />
                                <label> Meditation </label>
                                <input type="checkbox" name='meditate' checked={data.meditate} onChange={handleChange} />
                            </div>

                            <div>
                                <label>Desired Workout Duration (Hours) </label>
                                <input type="number" name='time' onChange={handleChange} />
                            </div>

                            <div>
                                <label>General Workout Plan </label>
                                <input type="checkbox" name='gplan' checked={data.gplan} onChange={handleChange} />
                            </div>
                            <div className="form_button">
                                <button className="submit" >
                                    Submit
                                </button>
                                <button className="get_data" onClick={getLocalPlan}>
                                    Get Data
                                </button>
                            </div>
                        </div>

                        <div >
                            <div className="footer">
                                <div className="show_response">
                                    {/* <button className="submit" >
                                        Submit
                                    </button>
                                    <button className="get_data" onClick={getLocalPlan}>
                                        Get Data
                                    </button> */}
                                    {table.length > 0 ?
                                        //  <h3 className="display_data">{response}</h3>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Index</th>
                                                    <th>Exercise</th>
                                                    <th>Sets</th>
                                                    <th>Reps</th>
                                                    <th>Activity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    table.map((curUser) => {
                                                        const { index, name, sets, reps } = curUser;
                                                        // editrow === index ? <Edit curUser={curUser} table={table} setTable={setTable} /> :
                                                        // <Print curUser={curUser}/>
                                                        if (editrow !== index) {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index}</td>
                                                                    <td>{name}</td>
                                                                    <td>{sets}</td>
                                                                    <td>{reps}</td>
                                                                    <td>
                                                                        <button className="edit" onClick={() => handleEdit(index)}>Edit</button>
                                                                        <button className="delete" onClick={() => handleDelete(index)}>Delete</button>

                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                        else {
                                                            // <Edit curUser={curUser} table={table} setTable={setTable}> </Edit>
                                                            return (
                                                                <tr >
                                                                    <td><input type="text" name="index" onChange={handleEditcolumn} value={curUser.index}></input></td>
                                                                    <td><input type="text" name="name" onChange={handleEditcolumn} value={curUser.name}></input></td>
                                                                    <td><input type="text" name="sets" onChange={handleEditcolumn} value={curUser.sets}></input></td>
                                                                    <td><input type="text" name="reps" onChange={handleEditcolumn} value={curUser.reps}></input></td>
                                                                    <td><button type="submit" className="update">Update</button></td>
                                                                </tr>)
                                                        }
                                                    }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                        :
                                        <p>Click on "Submit" button and wait for response...</p>
                                    }

                                    {table.length > 0 ?
                                        <div className="modification">
                                            {
                                                table.length > 0 ?
                                                    <button className="save" onClick={SaveExercise}>
                                                        Save
                                                    </button>
                                                    :
                                                    null
                                            }
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Chatgpt