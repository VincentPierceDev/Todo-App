import Link from 'next/link'
import styles from './navbar.module.css';

export default function NavBar() {
    
    return (
        <nav className={styles.navbar}>
            <Link className={styles.link} href="/">Home</Link>
            <Link className={styles.link} href="/form">Add Task</Link>
        </nav>
    )
}
