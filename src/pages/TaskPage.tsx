import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonButton,
  IonInput,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSpinner,
  IonIcon,
  IonToast
} from '@ionic/react';
import {
  personCircleOutline,
  addCircleOutline,
  logOutOutline,
  trashOutline,
  checkmarkOutline
} from 'ionicons/icons';

import { signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Toast } from '@capacitor/toast';

interface Task {
  id?: string;
  title: string;
  completed: boolean;
  uid?: string;
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUndo, setShowUndo] = useState(false);
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const history = useHistory();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    const q = query(collection(db, 'tasks'), where('uid', '==', user?.uid));
    const querySnapshot = await getDocs(q);
    const loadedTasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      loadedTasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    setTasks(loadedTasks);
    setLoading(false);
  };

  const vibrate = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const showToast = async (message: string) => {
    await Toast.show({ text: message, duration: 'short' });
  };

  const handleAddTask = async () => {
    if (taskTitle.trim() === '') return;

    const newTask: Task = {
      title: taskTitle,
      completed: false,
      uid: user?.uid
    };

    const docRef = await addDoc(collection(db, 'tasks'), newTask);
    setTasks([...tasks, { ...newTask, id: docRef.id }]);
    setTaskTitle('');
    await vibrate();
    await showToast('Task added');
  };

  const handleTaskToggle = async (index: number) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[index];
    task.completed = !task.completed;
    setTasks(updatedTasks);

    if (task.id) {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { completed: task.completed });
      await vibrate();
      await showToast(task.completed ? 'Task completed' : 'Task marked incomplete');
    }
  };

  const handleTaskDelete = async (index: number) => {
    const taskToDelete = tasks[index];
    if (taskToDelete.id) {
      const taskRef = doc(db, 'tasks', taskToDelete.id);
      await deleteDoc(taskRef);
    }

    setDeletedTask(taskToDelete);
    setTasks(tasks.filter((_, i) => i !== index));
    setShowUndo(true);
    await vibrate();
    await showToast('Task deleted');
  };

  const handleUndoDelete = async () => {
    if (deletedTask) {
      const docRef = doc(db, 'tasks', deletedTask.id!);
      await setDoc(docRef, deletedTask);
      setTasks([...tasks, deletedTask]);
      setDeletedTask(null);
      await showToast('Undo successful');
    }
    setShowUndo(false);
  };

  const handleClearCompleted = async () => {
    const remainingTasks: Task[] = [];
    for (const task of tasks) {
      if (task.completed && task.id) {
        await deleteDoc(doc(db, 'tasks', task.id));
      } else {
        remainingTasks.push(task);
      }
    }
    setTasks(remainingTasks);
    await showToast('Completed tasks cleared');
  };

  const handleSaveEdit = async (taskId: string, newTitle: string) => {
    if (newTitle.trim() === '') return;

    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, title: newTitle } : t
    );
    setTasks(updatedTasks);

    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { title: newTitle });

    setEditingTaskId(null);
    setEditedTitle('');
    await showToast('Task updated');
  };

  const handleLogout = async () => {
    await signOut(auth);
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear">
            <IonIcon icon={personCircleOutline} />
          </IonButton>
          <IonTitle>Task Manager</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {user?.email && (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
            Logged in as: {user.email}
          </p>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <IonSpinner name="dots" />
          </div>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTask();
              }}
            >
              <IonInput
                value={taskTitle}
                placeholder="Enter task title"
                onIonChange={(e) => setTaskTitle(e.detail.value!)}
              />
              <IonButton type="submit" expand="block" size="large">
                <IonIcon icon={addCircleOutline} slot="start" />
                Add Task
              </IonButton>
            </form>

            <IonButton
              expand="block"
              color="medium"
              style={{ marginTop: '1rem' }}
              onClick={handleClearCompleted}
            >
              🧹 Clear All Completed
            </IonButton>

            <IonList>
              {tasks.map((task, index) => (
                <IonItem key={task.id || index}>
                  <IonCheckbox
                    checked={task.completed}
                    onIonChange={() => handleTaskToggle(index)}
                    slot="start"
                  />
                  {editingTaskId === task.id ? (
                    <>
                     <IonInput
                        value={editedTitle}
                        onIonChange={(e) => setEditedTitle(e.detail.value!)}
                        onKeyDown={(e) => {
                          const keyEvent = e as React.KeyboardEvent<HTMLIonInputElement>;
                          if (keyEvent.key === 'Enter') {
                            handleSaveEdit(task.id!, editedTitle);
                          }
                        }}
                      />

                      <IonButton
                        fill="clear"
                        color="success"
                        onClick={() => handleSaveEdit(task.id!, editedTitle)}
                      >
                        <IonIcon icon={checkmarkOutline} />
                      </IonButton>
                    </>
                  ) : (
                    <IonLabel
                      style={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setEditingTaskId(task.id!);
                        setEditedTitle(task.title);
                      }}
                    >
                      {task.title}
                    </IonLabel>
                  )}
                  {task.completed && (
                    <IonButton
                      fill="clear"
                      color="danger"
                      onClick={() => handleTaskDelete(index)}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  )}
                </IonItem>
              ))}
            </IonList>
          </>
        )}

        <IonToast
          isOpen={showUndo}
          message="Task deleted"
          duration={5000}
          buttons={[
            {
              text: 'Undo',
              handler: handleUndoDelete
            }
          ]}
          onDidDismiss={() => setShowUndo(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default TaskPage;
