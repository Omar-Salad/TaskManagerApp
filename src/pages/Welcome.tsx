import {
    IonPage,
    IonContent,
    IonButton,
    IonText
  } from '@ionic/react';
  import { useHistory } from 'react-router-dom';
  import './Welcome.css';
  
  const Welcome: React.FC = () => {
    const history = useHistory();
  
    return (
      <IonPage>
        <IonContent>
          <div className="welcome-container">
          <IonText className="ion-text-center">
  <h1 className="ion-text-wrap" style={{ fontSize: '2rem' }}>Welcome</h1>
  <p style={{ fontSize: '1.5rem' }}>
  This is a task manager app for your daily productivity.
  </p>
</IonText>

         

            <IonButton expand="block"  size="large" onClick={() => history.push('/login')}>
              Login
            </IonButton>
            <IonButton expand="block" size="large" onClick={() => history.push('/register')}>
              Sign Up
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Welcome;
  