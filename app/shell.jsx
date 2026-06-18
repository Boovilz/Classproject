/* ============================================================
   APP SHELL — router + world switching + cinematic transitions
   ============================================================ */
const { StudentPortal } = window;

// detect student portal mode before mounting App
if (new URLSearchParams(window.location.search).has('portal')) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(StudentPortal)
  );
} else {

const {
  Login, Portal, TeacherShell, TeacherDashboard, Attendance, Health, StudentsGrid, BarcodeScore,
  BehaviorXP, SettingsPage, ClassroomFinance, AcademicRecords, HomeVisits, Documents, ParentCommunication,
  GameShell, GameHome, StudentProfile, TerritoryMap, RewardShop, GamesHub, ClassroomTools, StatusBoard,
  ClassroomKingdom, QuestBoard, HallOfFame, StudentGuild,
  BossRaid, PetSanctuary, SeasonHub, ScoreHistory,
  GuildWar, ClassAchieve, ClassroomAdmin,
} = window;

const LS = 'gcos.nav';
function loadNav() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }

function App() {
  const saved = React.useMemo(loadNav, []);
  const [stage, setStage] = React.useState(saved.stage || 'login');   // login | portal | app
  const [world, setWorld] = React.useState(saved.world || 'teacher'); // teacher | game
  const [tRoute, setTRoute] = React.useState(saved.tRoute || 'dashboard');
  const [gRoute, setGRoute] = React.useState(saved.gRoute || 'home');
  const [profile, setProfile] = React.useState(null);
  const [flash, setFlash] = React.useState(null);       // {world} during portal->app transition

  React.useEffect(() => {
    localStorage.setItem(LS, JSON.stringify({ stage, world, tRoute, gRoute }));
  }, [stage, world, tRoute, gRoute]);

  const openStudent = (id) => setProfile(id);

  // cinematic enter from portal
  const enterWorld = (w) => {
    setFlash(w);
    setTimeout(() => { setWorld(w); setStage('app'); }, 720);
    setTimeout(() => setFlash(null), 1180);
  };

  const goPortal = () => { setStage('portal'); };

  let body = null;
  if (stage === 'login') {
    body = <Login key="login" onLogin={() => setStage('portal')} />;
  } else if (stage === 'portal') {
    body = <Portal key="portal" onEnter={enterWorld} onLogout={() => setStage('login')} />;
  } else if (world === 'teacher') {
    const inner = tRoute === 'dashboard' ? <TeacherDashboard openStudent={openStudent} setRoute={setTRoute} />
      : tRoute === 'students' ? <StudentsGrid openStudent={openStudent} />
      : tRoute === 'attendance' ? <Attendance openStudent={openStudent} />
      : tRoute === 'classadmin' ? <ClassroomAdmin openStudent={openStudent} />
      : tRoute === 'behavior' ? <BehaviorXP openStudent={openStudent} />
      : tRoute === 'academic' ? <AcademicRecords openStudent={openStudent} />
      : tRoute === 'finance' ? <ClassroomFinance />
      : tRoute === 'health' ? <Health />
      : tRoute === 'homevisit' ? <HomeVisits openStudent={openStudent} />
      : tRoute === 'documents' ? <Documents />
      : tRoute === 'parent' ? <ParentCommunication openStudent={openStudent} />
      : tRoute === 'settings' ? <SettingsPage />
      : tRoute === 'barcode' ? <BarcodeScore />
      : <StudentsGrid openStudent={openStudent} />;
    body = (
      <TeacherShell key="t" route={tRoute} setRoute={setTRoute} onPortal={goPortal} onLogout={() => setStage('login')}>
        <div key={tRoute} className="rise">{inner}</div>
      </TeacherShell>
    );
  } else {
    const inner = gRoute === 'home' ? <ClassroomKingdom go={setGRoute} openStudent={openStudent} />
      : gRoute === 'territory' ? <TerritoryMap openStudent={openStudent} />
      : gRoute === 'shop' ? <RewardShop />
      : gRoute === 'games' ? <GamesHub openStudent={openStudent} />
      : gRoute === 'quests' ? <QuestBoard />
      : gRoute === 'hall' ? <HallOfFame openStudent={openStudent} />
      : gRoute === 'guild' ? <StudentGuild openStudent={openStudent} />
      : gRoute === 'boss' ? <BossRaid openStudent={openStudent} />
      : gRoute === 'pet' ? <PetSanctuary />
      : gRoute === 'season' ? <SeasonHub go={setGRoute} />
      : gRoute === 'guild' ? <GuildWar openStudent={openStudent} />
      : gRoute === 'classach' ? <ClassAchieve />
      : gRoute === 'tools' ? <ClassroomTools />
      : gRoute === 'scores' ? <ScoreHistory openStudent={openStudent} />
      : <StatusBoard openStudent={openStudent} />;
    body = (
      <GameShell key="g" route={gRoute} setRoute={setGRoute} onPortal={goPortal}>
        <div key={gRoute} className="rise">{inner}</div>
      </GameShell>
    );
  }

  return (
    <>
      <div style={{ position: 'absolute', inset: 0 }}>{body}</div>
      {profile && <StudentProfile studentId={profile} onClose={() => setProfile(null)} openStudent={openStudent} />}
      {/* cinematic portal flash */}
      {flash && (
        <div data-world={flash} style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none',
          background: flash === 'teacher'
            ? 'radial-gradient(circle at 50% 50%, oklch(0.6 0.13 255), oklch(0.4 0.14 262))'
            : 'radial-gradient(circle at 50% 50%, oklch(0.6 0.22 305), oklch(0.45 0.2 270))',
          animation: 'portalFlash 1.18s ease-in-out forwards' }}>
          <div className="center" style={{ position: 'absolute', inset: 0 }}>
            <div className="center col" style={{ gap: 14, animation: 'portalText 1.18s ease-out forwards' }}>
              <Icon name={flash === 'teacher' ? 'users' : 'game'} size={64} color="#fff" />
              <div className="display" style={{ fontSize: 26, color: '#fff' }}>
                {flash === 'teacher' ? 'เข้าสู่ระบบบริหารชั้นเรียน' : 'เข้าสู่โลกเกมมิฟิเคชัน'}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

} // end portal else
