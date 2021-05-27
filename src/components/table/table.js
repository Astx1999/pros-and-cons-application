import {useState, useEffect} from 'react';
import Textarea from "../textarea/textarea";
import {ReactComponent as Add} from '../../images/add.svg';
import {ReactComponent as Remove} from '../../images/remove.svg';
import styles from './table.module.scss'
import axios from "axios";

export default function Table() {
    const [title, setTitle] = useState('')
    const [state, setState] = useState(
        {
            pros: [],
            cons: []
        });
    const [newText, setNewText] = useState({pros: '', cons: ''})
    const [credentials, setCredential] = useState({})
    const [errorMessage, setErrorMessage] = useState('')
    useEffect(() => {
        (async () => {
            const groupId = await axios.get('https://avetiq-test.firebaseapp.com/group/astghik_hovhannisyan')
            const userId = await axios.get('https://avetiq-test.firebaseapp.com/user/astghik_hovhannisyan')
            setCredential({groupId: groupId.data.groupId, userId: userId.data.userId})
        })()
    }, [])
    useEffect(() => {
        if (credentials.groupId && credentials.userId) {
            axios
                .get(`https://avetiq-test.firebaseapp.com/proscons/group/${credentials.groupId}/user/${credentials.userId}`)
                .then(response => {
                    setState(response.data);

                });
        }
    }, [credentials])

    let data;


    const handleInputChange = (e, type, id) => {
        data = {...state}
        if (type === 'pros' || type === 'cons') {
            if (type === 'pros') {
                data.pros[id] = e.target.value
                setState(data)
            } else if (type === 'cons') {
                data.cons[id] = e.target.value
                setState(data)
            }
            axios
                .put(`https://avetiq-test.firebaseapp.com/proscons/group/${credentials.groupId}/user/${credentials.userId}`, data)
                .then(response => {
                    setState(response.data);
                    setErrorMessage('')
                })
                .catch(function (error) {
                    setErrorMessage('Something went wrong, please try again')
                });
        } else if (type === 'newPros') {
            setNewText({...newText, pros: e.target.value})

        } else if (type === 'newCons') {
            setNewText({...newText, cons: e.target.value})
        }
    }
    // The following function adds a row
    const handleAddRow = (type, value) => {
        data = {...state}
        if (type === "pros") {
            data.pros.push(value)
        } else {
            data.cons.push(value)
        }
        setNewText({pros: '', cons: ''})
        axios
            .put(`https://avetiq-test.firebaseapp.com/proscons/group/${credentials.groupId}/user/${credentials.userId}`, data)
            .then(response => {
                setState(response.data);
                setErrorMessage('')
            })
            .catch(function (error) {
                setErrorMessage('Something went wrong, please try again')
            });

    }
    // The following function deletes the row
    const handleRemoveRow = (type, id) => {
        data = {...state}
        if (type === "pros") {
            const list = [...state.pros];
            list.splice(id, 1);
            data.pros = list;
        } else {
            const list = [...state.cons];
            list.splice(id, 1);
            data.cons = list;
        }
        axios
            .put(`https://avetiq-test.firebaseapp.com/proscons/group/${credentials.groupId}/user/${credentials.userId}`, data)
            .then(response => {
                setState(response.data);
                setErrorMessage('')
            })
            .catch(function (error) {
                setErrorMessage('Something went wrong, please try again')

            });
    }
    useEffect(() => {
        data = {...state};
    }, [state])
    return (
        <>
            <p className={styles.error}>{errorMessage}</p>
            <div className={styles.table}>
                <div className={styles.titleWrapper}>
                    <Textarea
                        type={'title'}
                        value={title}
                        onChange={
                            (e) => {
                                setTitle(e.target.value)
                            }
                        }
                        placeholder={'Enter any title...'}
                    />
                </div>
                <div className={styles.subtitleWrapper}>
                    <div className={styles.subtitle}><span>Pros</span></div>
                    <div className={styles.subtitle}><span>Cons</span></div>
                </div>
                <div className={styles.body}>
                    <div className={styles.pros}>
                        {!!state.pros.length && state.pros.map((prosItem, index) => (
                            <div key={index} className={styles.row}>
                                <span className={styles.number}>{index + 1}.</span>
                                <Textarea
                                    type={'row'}
                                    value={prosItem}
                                    name={index}
                                    onChange={(e) => handleInputChange(e, 'pros', index)}
                                    placeholder={'Enter here pros...'}
                                />
                                <div
                                    className={styles.remove}
                                    onClick={() => handleRemoveRow('pros', index)}
                                >
                                    <Remove/>
                                </div>
                            </div>

                        ))}
                    </div>
                    <div className={styles.cons}>
                        {!!state.cons.length && state.cons.map((consItem, index) => (
                            <div key={index} className={styles.row}>
                                <span className={styles.number}>{index + 1}.</span>
                                <Textarea
                                    type={'row'}
                                    value={consItem}
                                    name={index}
                                    onChange={(e) => handleInputChange(e, 'cons', index)}
                                    placeholder={'Enter here cons...'}
                                />
                                <div
                                    className={styles.remove}
                                    onClick={() => handleRemoveRow('cons', index)}
                                >
                                    <Remove/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.pros}>
                        <Textarea
                            type={'row'}
                            value={newText.pros}
                            name={0}
                            onChange={(e) => handleInputChange(e, 'newPros', 0)}
                            placeholder={'Enter here cons...'}
                        />
                        <div
                            className={styles.add}
                            onClick={() => handleAddRow('pros', newText.pros)}
                        ><Add/>
                        </div>
                    </div>
                    <div className={styles.cons}>
                        <Textarea
                            type={'row'}
                            value={newText.cons}
                            name={0}
                            onChange={(e) => handleInputChange(e, 'newCons', 0)}
                            placeholder={'Enter here cons...'}
                        />
                        <div
                            className={styles.add}
                            onClick={() => handleAddRow('cons', newText.cons)}
                        ><Add/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}