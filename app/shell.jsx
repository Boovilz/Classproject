/* ============================================================
   APP SHELL — router
   ============================================================ */
const LS = 'gcos.nav';
function loadNav() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }

function App() {
  const {
    Login, TeacherShell, TeacherDashboard, Attendance, Health, StudentsGrid,
    SettingsPage, ClassroomFinance, AcademicRecords, HomeVisits, Documents, ParentCommunication,
    StudentProfile, HomeworkTracking, ClassroomAdmin,
  } = window;
  const saved = React.useMemo(loadNav, []);
  const [stage, setStage] = React.useState(saved.stage || 'login'); // login | app
  const [tRoute, setTRoute] = React.useState(saved.tRoute || 'dashboard');
  const [profile, setProfile] = React.useState(null);
  const [authReady, setAuthReady] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem(LS, JSON.stringify({ stage, tRoute }));
  }, [stage, tRoute]);

  React.useEffect(() => {
    window.SB.auth.getSession().then(({ data }) => {
      if (!data.session && stage !== 'login') setStage('login');
      setAuthReady(true);
    });
    const { data: sub } = window.SB.auth.onAuthStateChange((_event, session) => {
      if (!session) setStage('login');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const openStudent = (id) => setProfile(id);
  const logout = () => { window.SB.auth.signOut(); setStage('login'); };

  if (!authReady) return null;

  let body = null;
  if (stage === 'login') {
    body = <Login key="login" onLogin={() => setStage('app')} />;
  } else {
    const inner = tRoute === 'dashboard' ? <TeacherDashboard openStudent={openStudent} setRoute={setTRoute} />
      : tRoute === 'students' ? <StudentsGrid openStudent={openStudent} />
      : tRoute === 'attendance' ? <Attendance openStudent={openStudent} />
      : tRoute === 'classadmin' ? <ClassroomAdmin openStudent={openStudent} />
      : tRoute === 'academic' ? <AcademicRecords openStudent={openStudent} />
      : tRoute === 'homework' ? <HomeworkTracking openStudent={openStudent} />
      : tRoute === 'finance' ? <ClassroomFinance />
      : tRoute === 'health' ? <Health />
      : tRoute === 'homevisit' ? <HomeVisits openStudent={openStudent} />
      : tRoute === 'documents' ? <Documents />
      : tRoute === 'parent' ? <ParentCommunication openStudent={openStudent} />
      : tRoute === 'settings' ? <SettingsPage />
      : <StudentsGrid openStudent={openStudent} />;
    body = (
      <TeacherShell key="t" route={tRoute} setRoute={setTRoute} onLogout={logout}>
        <div key={tRoute} className="rise">{inner}</div>
      </TeacherShell>
    );
  }

  return (
    <>
      <div style={{ position: 'absolute', inset: 0 }}>{body}</div>
      {profile && <StudentProfile studentId={profile} onClose={() => setProfile(null)} openStudent={openStudent} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
