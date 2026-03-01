'use client'
import { useState, useEffect } from 'react';
import styles from './task-card.module.css';


interface Props {
    id: number,
    name: string,
    completed: boolean,
    deleteCallback: (id: number) => void
}

function DeleteButton(id: number, callback: (id: number) => void) {
    const deleteClick = async () => {
        await callback(id);
    }

    return(
        <button className={styles.delete} onClick={deleteClick}>
            🗑
        </button>
    )
}


export default function TaskCard(props: Props) {
    const [buttonChecked, setButtonChecked] = useState(false);
    const API_URL: String = process.env.NEXT_PUBLIC_BACKEND_BASE_URL as String;

    useEffect(() => {
        setButtonChecked(props.completed);
    }, [props.completed]);

    const toggleButton = async () => {
        const newSelectedValue: boolean = !buttonChecked;
        
        try {
            const updateData = {
                isComplete: newSelectedValue
            }

            const response = await fetch(`${API_URL}/todoitems/${props.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            console.log("here");

            if(!response.ok) {
                throw new Error(`Failed to retrieve task completion status for task ${props.id}`);
            } else {
                setButtonChecked(newSelectedValue);
            }

        } catch {
            throw new Error(`Could Not Update Card ${props.id} Value!`);
        }
    }

    const taskType = (completed: boolean) => {
        if(completed)
            return (
            <li className={styles.card}>
                <button className={styles['check-circle']} onClick={toggleButton}>
                    <span className={styles.check}>✓</span>
                </button>
                <span>{props.name}</span>
                {DeleteButton(props.id, props.deleteCallback)}
            </li>
            )
        else
            return (
            <li className={styles.card}>
                <button className={styles['check-circle']} onClick={toggleButton}/>
                <span>{props.name}</span>
                {DeleteButton(props.id, props.deleteCallback)}
            </li>
            )
    }

    return (taskType(buttonChecked));
}
