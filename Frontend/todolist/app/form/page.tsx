'use client'
import styles from './page.module.css';
import { SubmitEvent } from "react";
import NavBar from "../navbar";

function TaskForm() {
    const API_URL: String = process.env.NEXT_PUBLIC_BACKEND_BASE_URL as String;

    const submitNewTask = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData: FormData = new FormData(event.currentTarget);
            const taskName: String = formData.get('task-name') as String;
            const taskComplete: boolean = formData.has('task-complete');

            const res = await fetch(`${API_URL}/todoitems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({Name: taskName, IsComplete: taskComplete})
            });

            if(!res.ok)
                throw new Error('failed to save task on backend');
        } catch {
            throw new Error('Could not hit backend endpoint');
        }
    }

    return(
        <>
        <h1 className={styles.heading}>SUBMIT TASK</h1>
        <NavBar/>
        <form className={styles.form} onSubmit={submitNewTask}>
            <div className={styles['form-content']}>
                <div className={styles['input-row']}>
                    <label htmlFor="task-name">Task Name</label>
                    <input type="text" id="task-name" name="task-name"/>
                </div>
                <div className={styles['check-row']}>
                    <label htmlFor="task-complete">Task Completed?</label>
                    <input type="checkbox" id="task-complete" name="task-complete"/>
                </div>
                <button className={styles.submit} type="submit">Submit</button>
            </div>
        </form>
        </>
    )
}

export default TaskForm;