'use client'
import styles from "./page.module.css";
import NavBar from "./navbar";
import TaskCard from "./task-card";
import { useEffect, useState } from "react";

type Task = {
  id: number,
  name: string,
  isComplete: boolean
}

const API_URL: String = process.env.NEXT_PUBLIC_BACKEND_BASE_URL as String;

async function RemoveAllCompletedTasks(deleteCallback: (id: number) => void): Promise<void> {
  
  console.log('pressed button');
  const completedTaskResponse = await fetch(`${API_URL}/todoitems/complete`);
  console.log(completedTaskResponse);
  if(!completedTaskResponse.ok)
    throw new Error(`Failed to retrieve all completed tasks from the backend. Status ${completedTaskResponse.status}`);

  const completeTasks: Task[] = await completedTaskResponse.json();
  completeTasks.forEach(async task => {
    const deleteResponse = await fetch(`${API_URL}/todoitems/${task.id}`, {
      method: 'DELETE'
    });

    if(!deleteResponse.ok)
      throw new Error(`Failed to delete completed task ${task.id}. Status ${deleteResponse.status}`);

    deleteCallback(task.id);
  })
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const hitBackendPoint = async () => {

      try {
        const fetchedResponse = await fetch(`${API_URL}/todoitems`, {next: {revalidate: 3600}});

        if(!fetchedResponse.ok) {
          throw new Error('failed to retrieve todo items');
        }

        const data = await fetchedResponse.json();
        setTasks(data);
      } catch {
        throw new Error('failed to hit backend endpoint');
      }
    }

    hitBackendPoint();
    console.log('call');
  }, []);

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }
  
    //callback function for the cards to delete themselves and trigger a rerender
  const deleteCard = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/todoitems/${id}`, {
        method: "DELETE"
    });

    if(!response.ok)
      throw new Error(`Task ${id} Delete Response Unsuccessful. Status ${response.status}`);

    deleteTask(id);

    } catch {
      throw new Error(`Unknow Error Trying To Delete Task ${id}`);
    }

    console.log('delete called for some reason');
  }

  const determineDisplay = () => {

    const removeAllClick = async () => {
      await RemoveAllCompletedTasks(deleteTask);
    }

    if(tasks.length >= 1)
      return(
        <>
        <ul className={styles['task-panel']}>
        {
          tasks.map((x) => (
            <TaskCard key={x.id} id={x.id} name={x.name} completed={x.isComplete} deleteCallback={deleteCard}/>
          ))
        }
        </ul>
        <button onClick={removeAllClick} className={styles['remove-all-btn']}>Remove All Completed Tasks</button>
        </>
    );
    else
      return (
      <div className={styles['task-panel']}>
        <p className={styles['no-card']}>No Tasks Currently In Queue</p>
      </div>
    )
  }

  return (
    <>
      <h1 className={styles.heading}>TODOS</h1>
      <NavBar/>
      <div className={styles['panel-wrapper']}>
          {determineDisplay()}
      </div>
    </>
  );
}
