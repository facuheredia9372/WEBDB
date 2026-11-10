const API_URL = 'http://localhost:3000/api';
const API_ORIGIN = new URL(API_URL).origin;

const LANG = { actual: localStorage.getItem('ep_lang') || 'es' };
const loc = () => (LANG.actual === 'en' ? 'en-US' : 'es-AR');

const EN = {
  Inicio: 'Home', Proyectos: 'Projects', Tareas: 'Tasks', Perfil: 'Profile',
  'Panel Operativo Diario': 'Daily Operations Panel', 'Proyectos activos': 'Active projects',
  Pendientes: 'Pending', Urgentes: 'Urgent', 'Tarea prioritaria': 'Priority task',
  'Marcar completada': 'Mark as completed', 'Próximas tareas': 'Upcoming tasks',
  'No tenés tareas pendientes. Todo al día.': 'You have no pending tasks. All caught up.',
  Pendiente: 'Pending', 'En progreso': 'In progress', Completada: 'Completed',
  'Planificación': 'Planning', Finalizado: 'Finished', Todos: 'All', Todas: 'All',
  Baja: 'Low', Media: 'Medium', Alta: 'High', 'Crítica': 'Critical',
  'No hay proyectos en este estado.': 'There are no projects in this status.',
  'No hay tareas para mostrar.': 'There are no tasks to show.',
  'Mías': 'Mine', '+ Nueva tarea': '+ New task',
  'Vence hoy': 'Due today', 'Vence mañana': 'Due tomorrow',
  Tarea: 'Task', Proyecto: 'Project', Cliente: 'Client', Responsable: 'Assignee',
  Asignada: 'Assigned', 'Límite': 'Due', 'Cambiar estado': 'Change status',
  'Sin descripción': 'No description', 'Sin nombre': 'Unnamed', 'Imágenes': 'Images',
  'Todavía no hay imágenes.': 'No images yet.', 'Adjuntar imagen': 'Attach image',
  'Eliminar tarea': 'Delete task', 'Nueva tarea': 'New task', Nombre: 'Name',
  'Descripción': 'Description', Prioridad: 'Priority', 'Asignación': 'Assigned on',
  'Fecha límite': 'Due date', 'Crear tarea': 'Create task', 'Elegir…': 'Choose…',
  'Elegí un proyecto primero': 'Choose a project first', 'Cargando…': 'Loading…',
  'Período': 'Period', Equipo: 'Team', 'Tecnologías': 'Technologies',
  'Sin integrantes': 'No members', 'Sin tecnologías': 'No technologies',
  Mensajes: 'Messages', Enviar: 'Send', 'Escribí un mensaje al equipo…': 'Write a message to the team…',
  'Todavía no hay mensajes. Escribí el primero.': 'No messages yet. Write the first one.',
  '¿Confirmar el cambio?': 'Confirm the change?', Cancelar: 'Cancel', Confirmar: 'Confirm',
  Eliminar: 'Delete', Quitar: 'Remove', '¿Quitar esta imagen?': 'Remove this image?', Cerrar: 'Close',
  'Nuevo cliente': 'New client', Empresa: 'Company', 'Dirección': 'Address',
  'Guardar cliente': 'Save client', 'Acciones del líder': 'Leader actions',
  'Asignar a programador': 'Assign to a programmer', Programador: 'Programmer',
  'Además, asignarle una tarea': 'Also assign a task', Asignar: 'Assign',
  'Asignación realizada': 'Assignment done', 'Editar equipo': 'Edit team', 'Guardar equipo': 'Save team',
  'Cambiar foto': 'Change photo', 'Mis datos': 'My details', Apellido: 'Last name',
  'Teléfono': 'Phone', 'Guardar cambios': 'Save changes', 'Cambiar contraseña': 'Change password',
  'Contraseña actual': 'Current password', 'Nueva contraseña': 'New password',
  'Repetir nueva': 'Repeat new', 'Actualizar contraseña': 'Update password', Avisos: 'Notifications',
  'Avisarme de tareas vencidas o por vencer': 'Notify me about overdue or upcoming tasks',
  'Avisarme de mensajes nuevos en los proyectos': 'Notify me about new project messages',
  Tema: 'Theme', Oscuro: 'Dark', Claro: 'Light', Sistema: 'System', Idioma: 'Language',
  'Cerrar sesión': 'Log out',
  'Proyectos, equipos y tareas en un solo lugar.': 'Projects, teams and tasks in one place.',
  'Seguí tu trabajo diario, el avance de cada proyecto y lo que tiene prioridad hoy.':
    'Follow your daily work, each project’s progress and what has priority today.',
  'Crear cuenta': 'Create account', 'Iniciar sesión': 'Sign in', 'ID de empleado': 'Employee ID',
  Usuario: 'Username', 'Contraseña': 'Password', Registrarme: 'Sign up', Entrar: 'Log in',
  '¿Ya tenés cuenta?': 'Already have an account?', '¿No tenés cuenta?': 'No account yet?',
  Registrate: 'Sign up', 'Iniciá sesión': 'Sign in',
  'Cuenta creada. Ya podés iniciar sesión': 'Account created. You can now sign in',
  'Tarea creada': 'Task created', 'Tarea eliminada': 'Task deleted', 'Tarea completada': 'Task completed',
  'Estado actualizado': 'Status updated', 'Imagen adjuntada': 'Image attached',
  'Imagen eliminada': 'Image deleted', 'Datos actualizados': 'Details updated',
  'Contraseña actualizada': 'Password updated', 'Foto actualizada': 'Photo updated',
  'Preferencia guardada': 'Preference saved', 'Cliente creado': 'Client created',
  'Equipo actualizado': 'Team updated', 'La imagen supera los 5 MB': 'The image exceeds 5 MB',
  'La foto supera los 3 MB': 'The photo exceeds 3 MB',
  'No se pudo conectar con el servidor': 'Could not connect to the server',
  'El usuario debe tener entre 3 y 30 caracteres': 'The username must be 3 to 30 characters long',
  'La contraseña debe tener al menos 8 caracteres': 'The password must be at least 8 characters long',
  'La nueva contraseña debe tener al menos 8 caracteres': 'The new password must be at least 8 characters long',
  'Las contraseñas nuevas no coinciden': 'The new passwords do not match',
  'La fecha límite no puede ser anterior a la asignación': 'The due date cannot be before the assigned date',
};

const PATRONES = [
  [/^Hola, (.+)$/, 'Hello, $1'],
  [/^Usuario: (.+)$/, 'Username: $1'],
  [/^(\d+)% completado$/, '$1% completed'],
  [/^Vencida hace (\d+) d$/, 'Overdue by $1 d'],
  [/^Vence en (\d+) d$/, 'Due in $1 d'],
  [/^Mensaje nuevo de (.+)$/, 'New message from $1'],
  [/^Equipo · (.+)$/, 'Team · $1'],
  [/^¿Eliminar la tarea «(.+)»\? No se puede deshacer\.$/, 'Delete the task «$1»? This cannot be undone.'],
  [/^(\d+) tareas? requieren? tu atención: vencidas o con vencimiento hoy o mañana$/,
    '$1 task(s) need your attention: overdue or due today or tomorrow'],
];

function traducir(texto) {
  const k = texto.trim();
  if (!k) return texto;
  let en = EN[k];
  if (!en) {
    for (const [re, to] of PATRONES) {
      if (re.test(k)) { en = k.replace(re, to); break; }
    }
  }
  return en ? texto.replace(k, () => en) : texto;
}

function traducirNodo(nodo) {
  if (nodo.nodeType === Node.TEXT_NODE) {
    const t = traducir(nodo.nodeValue);
    if (t !== nodo.nodeValue) nodo.nodeValue = t;
    return;
  }
  if (nodo.nodeType !== Node.ELEMENT_NODE) return;
  const walker = document.createTreeWalker(nodo, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) traducirNodo(n);
  [nodo, ...nodo.querySelectorAll('[placeholder],[aria-label]')].forEach(el => {
    for (const a of ['placeholder', 'aria-label']) {
      if (el.hasAttribute(a)) el.setAttribute(a, traducir(el.getAttribute(a)));
    }
  });
}

function iniciarTraduccion() {
  document.documentElement.lang = LANG.actual;
  new MutationObserver(cambios => {
    if (LANG.actual !== 'en') return;
    for (const c of cambios) {
      if (c.type === 'characterData') traducirNodo(c.target);
      else c.addedNodes.forEach(traducirNodo);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
}

const PRIO = { 'Crítica': 0, 'Alta': 1, 'Media': 2, 'Baja': 3 };
const PRIOS = ['Baja', 'Media', 'Alta', 'Crítica'];
const ESTADOS = ['Pendiente', 'En progreso', 'Completada'];
const ESTADOS_PROY = ['Planificación', 'En progreso', 'Finalizado'];
const MODOS = { dark: 'Oscuro', light: 'Claro', system: 'Sistema' };
const TONE = {
  'Crítica': 'danger', 'Alta': 'warn', 'Media': 'info', 'Baja': 'muted',
  'Pendiente': 'warn', 'En progreso': 'info', 'Completada': 'success',
  'Planificación': 'violet', 'Finalizado': 'success',
};
const NAV = [
  ['inicio', 'Inicio', 'M3 11l9-8 9 8M5 10v10h14V10'],
  ['proyectos', 'Proyectos', 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
  ['tareas', 'Tareas', 'M4 7l2 2 3-3M4 17l2 2 3-3M13 8h7M13 18h7'],
  ['perfil', 'Perfil', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6'],
];

const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const icon = d => `<svg class="ico" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
const badge = v => `<span class="badge tone-${TONE[v]}">${esc(v)}</span>`;
const initials = u => ((u?.nombre?.[0] ?? '') + (u?.apellido?.[0] ?? '')).toUpperCase();
const tokenData = token => {
  try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return {}; }
};
const avatar = (u, extra = '') =>
  `<span class="avatar ${extra}">${u?.foto ? `<img src="${API_ORIGIN + u.foto}" alt="">` : initials(u)}</span>`;
const norm = s => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const day = s => { const [y, m, d] = s.slice(0, 10).split('-'); return new Date(y, m - 1, d); };
const fmt = s => (s ? day(s).toLocaleDateString(loc(), { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const loading = '<div class="skeleton"></div>';
const head = (title, action = '') => `<header class="head"><h1>${title}</h1>${action}</header>`;
const field = (name, label, type = 'text', extra = '') =>
  `<label class="field"><span>${label}</span><input name="${name}" type="${type}" required ${extra}></label>`;

class Api {
  constructor(base) {
    this.base = base;
    this.token = localStorage.getItem('ep_token');
    this.onExpire = null;
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('ep_token', token);
    else localStorage.removeItem('ep_token');
  }

  async request(path, method = 'GET', body) {
    let res;
    try {
      res = await fetch(this.base + path, {
        method,
        headers: {
          ...(!(body instanceof FormData) && { 'Content-Type': 'application/json' }),
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
        body: body instanceof FormData ? body : body && JSON.stringify(body),
      });
    } catch {
      throw new Error('No se pudo conectar con el servidor');
    }
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 401 && this.token) this.onExpire?.();
      throw new Error(data?.error || data?.mensaje || data?.message || `Error ${res.status}`);
    }
    return data;
  }

  get(path) { return this.request(path); }
  post(path, body) { return this.request(path, 'POST', body); }
  patch(path, body) { return this.request(path, 'PATCH', body); }
  put(path, body) { return this.request(path, 'PUT', body); }
  delete(path) { return this.request(path, 'DELETE'); }
}

class Tarea {
  constructor(r) {
    Object.assign(this, r, {
      nombre: r.nombre || r.titulo || r.nombre_tarea || r.tarea_nombre || r.tarea || 'Sin nombre',
      proyecto: r.proyecto ?? r.proyecto_nombre,
      cliente: r.cliente ?? r.cliente_nombre,
      empleado: r.empleado ?? r.empleado_nombre,
    });
  }

  get completada() { return this.estado === 'Completada'; }

  get plazo() {
    if (!this.fecha_limite || this.completada) return [fmt(this.fecha_limite), 'muted'];
    const n = Math.round((day(this.fecha_limite) - day(iso(new Date()))) / 864e5);
    if (n < 0) return [`Vencida hace ${-n} d`, 'danger'];
    if (n === 0) return ['Vence hoy', 'warn'];
    if (n === 1) return ['Vence mañana', 'warn'];
    return [`Vence en ${n} d`, 'muted'];
  }

  static ordenar(lista) {
    return [...lista].sort((a, b) =>
      a.completada - b.completada ||
      PRIO[a.prioridad] - PRIO[b.prioridad] ||
      String(a.fecha_limite).localeCompare(String(b.fecha_limite)));
  }

  fila(conEmpleado = false) {
    const [texto, tone] = this.plazo;
    const quien = conEmpleado && this.empleado ? ` · ${esc(this.empleado)}` : '';
    return `<article class="card task" tabindex="0" data-act="tarea" data-id="${this.id_tarea}">
      <div><h3>${esc(this.nombre)}</h3><p>${esc(this.proyecto ?? '')}${quien}</p></div>
      <div class="meta">${badge(this.prioridad)}${badge(this.estado)}<span class="due tone-${tone}">${texto}</span></div>
    </article>`;
  }
}

class Proyecto {
  constructor(r) {
    Object.assign(this, r, {
      id_proyecto: r.id_proyecto ?? r.id,
      nombre: r.nombre || r.nombre_proyecto || r.proyecto || r.titulo || 'Sin nombre',
      cliente: r.cliente ?? r.cliente_nombre,
    });
  }

  get pct() { return Math.round(this.progreso ?? 0); }

  tarjeta() {
    return `<article class="card proj" tabindex="0" data-act="proyecto" data-id="${this.id_proyecto}">
      <div>${badge(this.estado)}</div>
      <h3>${esc(this.nombre)}</h3><p>${esc(this.cliente ?? '')}</p>
      <small>${fmt(this.fecha_inicio)} – ${fmt(this.fecha_fin)}</small>
      <div class="bar"><i style="width:${this.pct}%"></i></div><small>${this.pct}% completado</small>
    </article>`;
  }
}

class App {
  constructor() {
    this.api = new Api(API_URL);
    this.api.onExpire = () => this.logout();
    this.user = null;
    this.tema = localStorage.getItem('ep_theme') || 'dark';
    this.tab = { tareas: 'Todas', proyectos: 'Todos' };
    this.scope = 'mias';
    this.navId = 0;
    this.chat = null;
    this.chatTimer = null;

    this.vistas = {
      inicio: () => this.vistaInicio(),
      proyectos: () => this.vistaProyectos(),
      tareas: () => this.vistaTareas(),
      perfil: () => this.vistaPerfil(),
    };

    this.formularios = {
      login: async d => {
        const r = await this.api.post('/auth/login', { username: norm(d.username), password: d.password });
        this.api.setToken(r.token);
        this.ir('inicio');
      },
      registro: async d => {
        const largo = d.username.trim().length;
        if (largo < 3 || largo > 30) throw new Error('El usuario debe tener entre 3 y 30 caracteres');
        if (d.password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres');
        await this.api.post('/auth/registro', {
          id_empleado: +d.id_empleado, nombre: d.nombre.trim(), username: norm(d.username), password: d.password,
        });
        this.toast('Cuenta creada. Ya podés iniciar sesión');
        this.ir('login');
      },
      datos: async d => {
        await this.api.patch('/perfil', d);
        Object.assign(this.user, d);
        this.toast('Datos actualizados');
        this.route();
      },
      password: async (d, form) => {
        if (d.nueva.length < 8) throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
        if (d.nueva !== d.repetir) throw new Error('Las contraseñas nuevas no coinciden');
        await this.api.post('/perfil/password', { actual: d.actual, nueva: d.nueva });
        form.reset();
        this.toast('Contraseña actualizada');
      },
      cliente: async d => {
        const datos = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v.trim() || null]));
        await this.api.post('/lider/clientes', datos);
        this.cerrar();
        this.toast('Cliente creado');
      },
      asignar: async d => {
        const empleado = +d.id_empleado;
        const proyecto = +d.id_proyecto;
        if (d.con_tarea && d.fecha_limite < d.fecha_asignacion) {
          throw new Error('La fecha límite no puede ser anterior a la asignación');
        }
        const { equipo = [] } = await this.api.get(`/proyectos/${proyecto}`);
        const ids = equipo.map(m => m.id_empleado);
        if (!ids.includes(empleado)) {
          await this.api.put(`/lider/proyectos/${proyecto}/equipo`, { empleados: [...ids, empleado] });
        }
        if (d.con_tarea) {
          await this.api.post('/tareas', {
            nombre: d.nombre, descripcion: d.descripcion, prioridad: d.prioridad,
            fecha_asignacion: d.fecha_asignacion, fecha_limite: d.fecha_limite,
            estado: 'Pendiente', id_proyecto: proyecto, id_empleado: empleado,
          });
        }
        this.cerrar();
        this.toast('Asignación realizada');
        this.draw();
      },
      equipo: async (d, form) => {
        const empleados = [...form.querySelectorAll('input[name=emp]:checked')].map(i => +i.value);
        await this.api.put(`/lider/proyectos/${form.dataset.id}/equipo`, { empleados });
        this.toast('Equipo actualizado');
        this.verProyecto(form.dataset.id);
        this.draw();
      },
      mensaje: async (d, form) => {
        await this.api.post(`/proyectos/${this.chat.id}/mensajes`, { texto: d.texto });
        form.reset();
        await this.cargarChat();
      },
      tarea: async d => {
        if (d.fecha_limite < d.fecha_asignacion) throw new Error('La fecha límite no puede ser anterior a la asignación');
        await this.api.post('/tareas', { ...d, estado: 'Pendiente', id_proyecto: +d.id_proyecto, id_empleado: +d.id_empleado });
        this.cerrar();
        this.toast('Tarea creada');
        this.draw();
      },
    };

    this.acciones = {
      cerrar: () => this.cerrar(),
      salir: () => this.logout(),
      nueva: () => this.nuevaTarea(),
      tarea: ({ id }) => this.verTarea(id),
      proyecto: ({ id }) => this.verProyecto(id),
      tema: ({ v }) => { this.aplicarTema(v); this.draw(); },
      filtro: ({ k, v }) => { this.tab[k] = v; this.draw(); },
      scope: ({ v }) => { this.scope = v; this.draw(); },
      completar: ({ id }) => this.cambiarEstado(id, 'Completada'),
      cliente: () => this.nuevoCliente(),
      asignar: () => this.asignar(),
      equipo: ({ id }) => this.editarEquipo(id),
      idioma: ({ v }) => this.cambiarIdioma(v),
      quitarimg: async ({ id, a }) => {
        if (!await this.confirmar('¿Quitar esta imagen?', 'Quitar', true)) return;
        await this.api.delete(`/tareas/${id}/adjuntos/${a}`);
        this.toast('Imagen eliminada');
        this.verTarea(id);
      },
      estado: ({ id, v }) => this.cambiarEstado(id, v),
      borrar: async ({ id, n }) => {
        if (!await this.confirmar(`¿Eliminar la tarea «${n}»? No se puede deshacer.`, 'Eliminar', true)) return;
        await this.api.delete(`/tareas/${id}`);
        this.cerrar();
        this.toast('Tarea eliminada');
        this.draw();
      },
    };
  }

  get lider() { return norm(String(this.user?.rol_app ?? '')) === 'lider'; }

  ir(nombre) {
    if (location.hash === `#/${nombre}`) this.route();
    else location.hash = `#/${nombre}`;
  }

  aplicarTema(modo = this.tema) {
    this.tema = modo;
    localStorage.setItem('ep_theme', modo);
    const oscuro = modo === 'dark' || (modo === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = oscuro ? 'dark' : 'light';
  }

  toast(msg, error = false) {
    const el = document.createElement('div');
    el.className = 'toast' + (error ? ' err' : '');
    el.textContent = msg;
    $('#toast').append(el);
    setTimeout(() => el.remove(), 3500);
  }

  fallo(e) { this.toast(e.message, true); }

  confirmar(mensaje, accion = 'Confirmar', peligro = false) {
    return new Promise(resolve => {
      const el = document.createElement('div');
      el.className = 'overlay alto';
      el.innerHTML = `<div class="modal chico" role="alertdialog" aria-modal="true"><h2>${esc(mensaje)}</h2>
        <div class="actions"><button class="btn ghost" data-r="0">Cancelar</button>
        <button class="btn ${peligro ? 'danger' : ''}" data-r="1">${accion}</button></div></div>`;
      el.addEventListener('click', e => {
        e.stopPropagation();
        const btn = e.target.closest('[data-r]');
        if (!btn && e.target !== el) return;
        el.remove();
        resolve(btn?.dataset.r === '1');
      });
      document.body.append(el);
      el.querySelector('[data-r="1"]').focus();
    });
  }

  async cambiarEstado(id, estado) {
    if (!await this.confirmar('¿Confirmar el cambio?', 'Confirmar')) return;
    await this.api.patch(`/tareas/${id}/estado`, { estado });
    this.toast('Estado actualizado');
    if ($('#modal').innerHTML) this.verTarea(id);
    this.draw();
  }

  modal(titulo, cuerpo) {
    $('#modal').innerHTML = `<div class="overlay"><div class="modal" role="dialog" aria-modal="true">
      <header><h2>${esc(titulo)}</h2><button class="icon-btn" data-act="cerrar" aria-label="Cerrar">✕</button></header>${cuerpo}
    </div></div>`;
  }

  cerrar() {
    clearInterval(this.chatTimer);
    $('#modal').innerHTML = '';
  }

  chips(clave, opciones) {
    return `<div class="chips">${opciones.map(o =>
      `<button class="chip ${this.tab[clave] === o ? 'on' : ''}" data-act="filtro" data-k="${clave}" data-v="${o}">${o}</button>`).join('')}</div>`;
  }

  async vistaInicio() {
    const query = this.lider ? `?empleado=${this.user.id_empleado}` : '';
    const [panel, tareas, proyectos] = await Promise.all([
      this.api.get('/panel'), this.api.get('/tareas' + query), this.api.get('/proyectos'),
    ]);
    const pend = Tarea.ordenar(tareas.map(t => new Tarea(t))).filter(t => !t.completada);
    const top = panel.tarea_prioritaria ? new Tarea(panel.tarea_prioritaria) : pend[0];
    const resto = pend.filter(t => t.id_tarea !== top?.id_tarea);
    const porVencer = this.user.avisar_vencimientos === false ? [] : pend.filter(t => ['danger', 'warn'].includes(t.plazo[1]));
    const aviso = porVencer.length
      ? `<a class="card aviso" href="#/tareas">${icon('M12 3l10 18H2zM12 10v5M12 18v.01')}<span>${porVencer.length} ${porVencer.length === 1 ? 'tarea requiere' : 'tareas requieren'} tu atención: vencidas o con vencimiento hoy o mañana</span></a>`
      : '';
    const stats = [
      ['Proyectos activos', proyectos.filter(p => p.estado === 'En progreso').length, 'info'],
      ['Pendientes', panel.pendientes ?? pend.length, 'warn'],
      ['Urgentes', panel.urgentes ?? pend.filter(t => t.prioridad === 'Crítica').length, 'danger'],
    ];
    const hoy = new Date().toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const [textoTop, toneTop] = top ? top.plazo : [];
    return `
      <section class="hero"><span>Panel Operativo Diario</span><h1>Hola, ${esc(this.user.nombre)}</h1><p>${hoy}</p></section>
      ${aviso}
      <div class="grid stats">${stats.map(([l, v, tone]) =>
        `<div class="card stat tone-${tone}"><span>${l}</span><strong>${v}</strong></div>`).join('')}</div>
      ${this.lider ? `<h2 class="sec">Acciones del líder</h2><div class="actions">
        <button class="btn ghost" data-act="cliente">${icon('M12 5v14M5 12h14')}Nuevo cliente</button>
        <button class="btn" data-act="asignar">${icon('M12 5v14M5 12h14')}Asignar a programador</button></div>` : ''}
      <h2 class="sec">Tarea prioritaria</h2>
      ${top ? `<div class="card top" tabindex="0" data-act="tarea" data-id="${top.id_tarea}"><h3>${esc(top.nombre)}</h3><p>${esc(top.proyecto ?? '')}</p>
        <div class="meta">${badge(top.prioridad)}${badge(top.estado)}<span class="due tone-${toneTop}">${textoTop}</span></div>
        <div class="actions"><button class="btn" data-act="completar" data-id="${top.id_tarea}" data-n="${esc(top.nombre)}">Marcar completada</button></div></div>` : '<div class="card empty">No tenés tareas pendientes. Todo al día.</div>'}
      ${resto.length ? `<h2 class="sec">Próximas tareas</h2><div class="list">${resto.slice(0, 5).map(t => t.fila()).join('')}</div>` : ''}`;
  }

  async vistaProyectos() {
    const filtro = this.tab.proyectos;
    const lista = (await this.api.get('/proyectos')).map(p => new Proyecto(p))
      .filter(p => filtro === 'Todos' || p.estado === filtro);
    return head('Proyectos') + this.chips('proyectos', ['Todos', ...ESTADOS_PROY]) +
      `<div class="grid cols">${lista.map(p => p.tarjeta()).join('') || '<div class="card empty">No hay proyectos en este estado.</div>'}</div>`;
  }

  async vistaTareas() {
    const query = this.lider ? `?empleado=${this.scope === 'todas' ? 'todos' : this.user.id_empleado}` : '';
    const filtro = this.tab.tareas;
    const lista = Tarea.ordenar((await this.api.get('/tareas' + query)).map(t => new Tarea(t)))
      .filter(t => filtro === 'Todas' || t.estado === filtro);
    const alcance = this.lider ? `<div class="chips">${[['mias', 'Mías'], ['todas', 'Todas']].map(([v, l]) =>
      `<button class="chip ${this.scope === v ? 'on' : ''}" data-act="scope" data-v="${v}">${l}</button>`).join('')}</div>` : '';
    const conEmpleado = this.lider && this.scope === 'todas';
    return head('Tareas', this.lider ? '<button class="btn" data-act="nueva">+ Nueva tarea</button>' : '') +
      alcance + this.chips('tareas', ['Todas', ...ESTADOS]) +
      `<div class="list">${lista.map(t => t.fila(conEmpleado)).join('') || '<div class="card empty">No hay tareas para mostrar.</div>'}</div>`;
  }

  async vistaPerfil() {
    const u = this.user;
    const aviso = (clave, texto) => `<label class="opcion"><span>${texto}</span>
      <input type="checkbox" data-sel="aviso" data-k="${clave}" ${u[clave] === false ? '' : 'checked'}></label>`;
    return head('Perfil') + `
      <div class="card profile">${avatar(u, 'lg')}
        <div><h2>${esc(u.nombre)} ${esc(u.apellido ?? '')}</h2><p>${esc(u.cargo ?? u.rol ?? '')}</p>
          <span class="badge tone-info">${esc(u.rol_app ?? 'sin rol')}</span>
          <label class="btn ghost sm subir">Cambiar foto
            <input type="file" accept="image/jpeg,image/png,image/webp" data-sel="foto" hidden></label></div></div>
      <div class="card seccion"><h3>Mis datos</h3><small>Usuario: ${esc(u.username ?? '—')}</small>
        <form data-form="datos">
          <div class="two">${field('nombre', 'Nombre', 'text', `value="${esc(u.nombre)}" maxlength="50"`)}${field('apellido', 'Apellido', 'text', `value="${esc(u.apellido)}" maxlength="50"`)}</div>
          ${field('email', 'Email', 'email', `value="${esc(u.email)}"`)}
          <label class="field"><span>Teléfono</span><input name="telefono" type="tel" maxlength="30" value="${esc(u.telefono)}"></label>
          <p class="err"></p><button class="btn">Guardar cambios</button>
        </form></div>
      <div class="card seccion"><h3>Cambiar contraseña</h3>
        <form data-form="password">
          ${field('actual', 'Contraseña actual', 'password', 'autocomplete="current-password"')}
          <div class="two">${field('nueva', 'Nueva contraseña', 'password', 'autocomplete="new-password"')}${field('repetir', 'Repetir nueva', 'password', 'autocomplete="new-password"')}</div>
          <p class="err"></p><button class="btn">Actualizar contraseña</button>
        </form></div>
      <div class="card seccion"><h3>Avisos</h3>
        ${aviso('avisar_vencimientos', 'Avisarme de tareas vencidas o por vencer')}
        ${aviso('avisar_mensajes', 'Avisarme de mensajes nuevos en los proyectos')}</div>
      <div class="card seccion"><h3>Idioma</h3><div class="chips">${[['es', 'Español'], ['en', 'English']].map(([c, l]) =>
        `<button class="chip ${LANG.actual === c ? 'on' : ''}" data-act="idioma" data-v="${c}">${l}</button>`).join('')}</div></div>
      <div class="card seccion"><h3>Tema</h3><div class="chips">${Object.entries(MODOS).map(([m, l]) =>
        `<button class="chip ${this.tema === m ? 'on' : ''}" data-act="tema" data-v="${m}">${l}</button>`).join('')}</div></div>
      <button class="btn danger" data-act="salir">Cerrar sesión</button>`;
  }

  async draw(nombre = location.hash.slice(2) || 'inicio') {
    const id = ++this.navId;
    let html;
    try { html = await this.vistas[nombre](); } catch (e) { html = `<div class="card empty">${esc(e.message)}</div>`; }
    if (id === this.navId && $('#view')) $('#view').innerHTML = html;
  }

  async route() {
    const nombre = location.hash.slice(2) || 'inicio';
    if (!this.api.token) return this.auth(nombre === 'registro');
    if (!this.user) {
      try {
        const r = await this.api.get('/auth/me');
        const extra = await this.api.get('/perfil').catch(() => ({}));
        this.user = { ...tokenData(this.api.token), ...(r.usuario ?? r), ...extra };
        if (!this.lider && await this.probarLider()) this.user.rol_app = 'lider';
      } catch { return; }
    }
    if (!this.vistas[nombre]) return this.ir('inicio');
    const links = NAV.map(([id, label, d]) =>
      `<a class="nav-link ${id === nombre ? 'on' : ''}" href="#/${id}">${icon(d)}<span>${label}</span></a>`).join('');
    const u = this.user;
    $('#app').innerHTML = `<div class="shell">
      <aside class="side"><div class="brand"><img class="logo" src="logo.png" alt="">AeroCode</div><nav>${links}</nav>
        <div class="me">${avatar(u)}
          <div><strong>${esc(u.nombre)}</strong><small>${esc(u.cargo ?? u.rol_app)}</small></div></div></aside>
      <main id="view">${loading}</main>
      <nav class="tabbar">${links}</nav></div>`;
    this.draw(nombre);
  }

  auth(registro) {
    $('#app').innerHTML = `<div class="auth">
      <section class="hero-side"><div class="brand"><img class="logo" src="logo.png" alt="">AeroCode</div>
        <h1>Proyectos, equipos y tareas en un solo lugar.</h1>
        <p>Seguí tu trabajo diario, el avance de cada proyecto y lo que tiene prioridad hoy.</p></section>
      <section class="auth-card">
        <select data-sel="tema" aria-label="Tema">${Object.entries(MODOS).map(([m, l]) =>
          `<option value="${m}" ${this.tema === m ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <form data-form="${registro ? 'registro' : 'login'}">
          <h2>${registro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
          ${registro ? field('id_empleado', 'ID de empleado', 'number') + field('nombre', 'Nombre') : ''}
          ${field('username', 'Usuario', 'text', 'autocomplete="username"')}
          ${field('password', 'Contraseña', 'password', `autocomplete="${registro ? 'new' : 'current'}-password"`)}
          <p class="err"></p>
          <button class="btn block">${registro ? 'Registrarme' : 'Entrar'}</button>
          <p class="alt">${registro ? '¿Ya tenés cuenta? <a href="#/login">Iniciá sesión</a>' : '¿No tenés cuenta? <a href="#/registro">Registrate</a>'}</p>
        </form></section></div>`;
  }

  logout() {
    this.api.setToken(null);
    this.user = null;
    this.ir('login');
  }

  async verTarea(id) {
    this.modal('Tarea', loading);
    try {
      const [datos, imgs] = await Promise.all([
        this.api.get(`/tareas/${id}`),
        this.api.get(`/tareas/${id}/adjuntos`).catch(() => []),
      ]);
      const t = new Tarea(datos);
      const [texto, tone] = t.plazo;
      this.modal(t.nombre, `
        <div class="meta">${badge(t.prioridad)}</div>
        <p class="desc">${esc(t.descripcion || 'Sin descripción')}</p>
        <dl class="info">
          <dt>Proyecto</dt><dd>${esc(t.proyecto ?? '—')}</dd>
          <dt>Cliente</dt><dd>${esc(t.cliente ?? '—')}</dd>
          <dt>Responsable</dt><dd>${esc(t.empleado ?? '—')}</dd>
          <dt>Asignada</dt><dd>${fmt(t.fecha_asignacion)}</dd>
          <dt>Límite</dt><dd>${fmt(t.fecha_limite)} <span class="due tone-${tone}">${texto}</span></dd>
        </dl>
        <h3>Cambiar estado</h3>
        <div class="chips">${ESTADOS.map(s =>
          `<button class="chip ${t.estado === s ? 'on' : ''}" data-act="estado" data-id="${id}" data-v="${s}" data-n="${esc(t.nombre)}" ${t.estado === s ? 'disabled' : ''}>${s}</button>`).join('')}</div>
        ${this.galeria(id, imgs)}
        ${this.lider ? `<div class="actions"><button class="btn danger" data-act="borrar" data-id="${id}" data-n="${esc(t.nombre)}">Eliminar tarea</button></div>` : ''}`);
    } catch (e) { this.cerrar(); this.fallo(e); }
  }

  async verProyecto(id) {
    this.modal('Proyecto', loading);
    try {
      const p = new Proyecto(await this.api.get(`/proyectos/${id}`));
      const equipo = (p.equipo ?? []).map(m => `<li><span class="avatar">${initials(m)}</span>
        <div><strong>${esc(m.nombre)} ${esc(m.apellido ?? '')}</strong><small>${esc(m.rol ?? m.cargo ?? '')}</small></div></li>`).join('');
      const techs = (p.tecnologias ?? []).map(t => `<span class="badge tone-info">${esc(t.nombre ?? t)}</span>`).join('');
      this.modal(p.nombre, `
        <div class="meta">${badge(p.estado)}</div>
        <p class="desc">${esc(p.descripcion || 'Sin descripción')}</p>
        <dl class="info"><dt>Cliente</dt><dd>${esc(p.cliente ?? '—')}</dd>
          <dt>Período</dt><dd>${fmt(p.fecha_inicio)} – ${fmt(p.fecha_fin)}</dd></dl>
        <h3>Equipo</h3><ul class="people">${equipo || '<small>Sin integrantes</small>'}</ul>
        ${this.lider ? `<div class="actions"><button class="btn ghost" data-act="equipo" data-id="${id}">Editar equipo</button></div>` : ''}
        <h3>Tecnologías</h3><div class="meta">${techs || '<small>Sin tecnologías</small>'}</div>
        <h3>Mensajes</h3><div class="chat" id="chat"><small>Cargando…</small></div>
        <form data-form="mensaje" class="enviar">
          <input name="texto" maxlength="500" placeholder="Escribí un mensaje al equipo…" autocomplete="off" required>
          <button class="btn">Enviar</button></form><p class="err"></p>`);
      this.abrirChat(id);
    } catch (e) { this.cerrar(); this.fallo(e); }
  }

  async nuevaTarea() {
    this.modal('Nueva tarea', loading);
    try {
      const proyectos = (await this.api.get('/proyectos')).map(p => new Proyecto(p));
      this.modal('Nueva tarea', `<form data-form="tarea">
        ${field('nombre', 'Nombre')}
        <label class="field"><span>Descripción</span><textarea name="descripcion" rows="3"></textarea></label>
        <label class="field"><span>Proyecto</span><select name="id_proyecto" data-sel="equipo" required>
          <option value="">Elegir…</option>${proyectos.map(p => `<option value="${p.id_proyecto}">${esc(p.nombre)}</option>`).join('')}</select></label>
        <label class="field"><span>Responsable</span><select name="id_empleado" required><option value="">Elegí un proyecto primero</option></select></label>
        <label class="field"><span>Prioridad</span><select name="prioridad">${PRIOS.map(p =>
          `<option value="${p}" ${p === 'Media' ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
        <div class="two">${field('fecha_asignacion', 'Asignación', 'date', `value="${iso(new Date())}"`)}${field('fecha_limite', 'Fecha límite', 'date')}</div>
        <p class="err"></p><button class="btn block">Crear tarea</button></form>`);
    } catch (e) { this.cerrar(); this.fallo(e); }
  }

  async cargarEquipo(select) {
    const emp = select.form.id_empleado;
    emp.innerHTML = '<option value="">Cargando…</option>';
    try {
      const p = select.value ? await this.api.get(`/proyectos/${select.value}`) : { equipo: [] };
      emp.innerHTML = '<option value="">Elegir…</option>' + (p.equipo ?? []).map(m =>
        `<option value="${m.id_empleado}">${esc(m.nombre)} ${esc(m.apellido ?? '')}</option>`).join('');
    } catch (e) { this.fallo(e); }
  }

  abrirChat(id) {
    clearInterval(this.chatTimer);
    this.chat = { id, ultimo: 0, cargando: false };
    this.cargarChat(true);
    this.chatTimer = setInterval(() => this.cargarChat(), 5000);
  }

  async cargarChat(inicial = false) {
    const caja = $('#chat');
    if (!caja) return clearInterval(this.chatTimer);
    if (this.chat.cargando) return;
    this.chat.cargando = true;
    try {
      const nuevos = await this.api.get(`/proyectos/${this.chat.id}/mensajes?despues=${this.chat.ultimo}`);
      if (!nuevos.length) {
        if (inicial) caja.innerHTML = '<small>Todavía no hay mensajes. Escribí el primero.</small>';
        return;
      }
      const abajo = inicial || caja.scrollHeight - caja.scrollTop - caja.clientHeight < 40;
      if (this.chat.ultimo === 0) caja.innerHTML = '';
      caja.insertAdjacentHTML('beforeend', nuevos.map(m => this.burbuja(m)).join(''));
      this.chat.ultimo = nuevos[nuevos.length - 1].id_mensaje;
      const ajenos = nuevos.filter(m => !m.propio && !m.sistema);
      if (!inicial && ajenos.length && this.user.avisar_mensajes !== false) {
        this.toast(`Mensaje nuevo de ${ajenos.at(-1).nombre}`);
      }
      if (abajo) caja.scrollTop = caja.scrollHeight;
    } catch (e) {
      if (inicial) caja.innerHTML = `<small>${esc(e.message)}</small>`;
    } finally {
      this.chat.cargando = false;
    }
  }

  burbuja(m) {
    const nombre = `${m.nombre} ${m.apellido ?? ''}`.trim();
    const hora = new Date(m.fecha).toLocaleString(loc(), { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    if (m.sistema) return `<p class="evento"><b>${esc(nombre)}</b> ${esc(m.texto)} · ${hora}</p>`;
    const propio = m.propio;
    return `<div class="msg ${propio ? 'propio' : ''}"><small>${propio ? 'Vos' : esc(nombre)} · ${hora}</small><p>${esc(m.texto)}</p></div>`;
  }

  galeria(id, imgs) {
    const fotos = imgs.map(a => {
      const src = API_ORIGIN + a.url;
      const puede = this.lider || a.propio;
      return `<figure><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${esc(a.nombre_original)}" loading="lazy"></a>
        ${puede ? `<button class="quitar" data-act="quitarimg" data-id="${id}" data-a="${a.id_adjunto}" aria-label="Quitar imagen">✕</button>` : ''}</figure>`;
    }).join('');
    return `<h3>Imágenes</h3><div class="galeria">${fotos || '<small>Todavía no hay imágenes.</small>'}</div>
      <label class="btn ghost subir">Adjuntar imagen<input type="file" accept="image/jpeg,image/png,image/webp" data-sel="imagen" data-id="${id}" hidden></label>`;
  }

  async subirImagen(input) {
    const [archivo] = input.files;
    if (!archivo) return;
    if (archivo.size > 5 * 1024 * 1024) return this.toast('La imagen supera los 5 MB', true);
    const datos = new FormData();
    datos.append('imagen', archivo);
    try {
      await this.api.post(`/tareas/${input.dataset.id}/adjuntos`, datos);
      this.toast('Imagen adjuntada');
      this.verTarea(input.dataset.id);
    } catch (e) { this.fallo(e); }
  }

  async asignar() {
    this.modal('Asignar a programador', loading);
    try {
      const [cat, lista] = await Promise.all([this.api.get('/lider/catalogos'), this.api.get('/proyectos')]);
      const proyectos = lista.map(p => new Proyecto(p));
      const opciones = (lista, id, texto) => lista.map(x => `<option value="${x[id]}">${esc(texto(x))}</option>`).join('');
      this.modal('Asignar a programador', `<form data-form="asignar">
        <label class="field"><span>Programador</span><select name="id_empleado" required>
          <option value="">Elegir…</option>${opciones(cat.empleados ?? [], 'id_empleado', e => `${e.nombre} ${e.apellido ?? ''}`)}</select></label>
        <label class="field"><span>Proyecto</span><select name="id_proyecto" required>
          <option value="">Elegir…</option>${opciones(proyectos, 'id_proyecto', p => p.nombre)}</select></label>
        <label class="opcion"><span>Además, asignarle una tarea</span><input type="checkbox" name="con_tarea" data-sel="con-tarea"></label>
        <div class="bloque-tarea" hidden>
          <label class="field"><span>Nombre</span><input name="nombre" maxlength="100" data-req></label>
          <label class="field"><span>Descripción</span><textarea name="descripcion" rows="2"></textarea></label>
          <label class="field"><span>Prioridad</span><select name="prioridad">${PRIOS.map(p =>
            `<option value="${p}" ${p === 'Media' ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
          <div class="two">
            <label class="field"><span>Asignación</span><input name="fecha_asignacion" type="date" value="${iso(new Date())}" data-req></label>
            <label class="field"><span>Fecha límite</span><input name="fecha_limite" type="date" data-req></label>
          </div>
        </div>
        <p class="err"></p><button class="btn block">Asignar</button></form>`);
    } catch (e) { this.cerrar(); this.fallo(e); }
  }

  async probarLider() {
    const res = await fetch(`${API_URL}/lider/catalogos`, {
      headers: { Authorization: `Bearer ${this.api.token}` },
    }).catch(() => null);
    return [200, 404].includes(res?.status);
  }

  alternarTarea(check) {
    const bloque = check.form.querySelector('.bloque-tarea');
    bloque.hidden = !check.checked;
    bloque.querySelectorAll('[data-req]').forEach(i => { i.required = check.checked; });
  }

  nuevoCliente() {
    this.modal('Nuevo cliente', `<form data-form="cliente">
      ${field('nombre', 'Nombre', 'text', 'maxlength="100"')}
      ${field('empresa', 'Empresa', 'text', 'maxlength="100"')}
      ${field('email', 'Email', 'email')}
      <label class="field"><span>Teléfono</span><input name="telefono" type="tel" maxlength="30"></label>
      <label class="field"><span>Dirección</span><input name="direccion" maxlength="150"></label>
      <p class="err"></p><button class="btn block">Guardar cliente</button></form>`);
  }

  async editarEquipo(id) {
    this.modal('Equipo', loading);
    try {
      const [p, cat] = await Promise.all([this.api.get(`/proyectos/${id}`), this.api.get('/lider/catalogos')]);
      const actuales = new Set((p.equipo ?? []).map(m => m.id_empleado));
      const filas = (cat.empleados ?? []).map(e => `<label class="opcion">
        <span>${esc(e.nombre)} ${esc(e.apellido ?? '')} <small>${esc(e.rol ?? e.cargo ?? '')}</small></span>
        <input type="checkbox" name="emp" value="${e.id_empleado}" ${actuales.has(e.id_empleado) ? 'checked' : ''}></label>`).join('');
      this.modal(`Equipo · ${p.nombre}`, `<form data-form="equipo" data-id="${id}">
        <div class="checks">${filas}</div><p class="err"></p><button class="btn block">Guardar equipo</button></form>`);
    } catch (e) { this.cerrar(); this.fallo(e); }
  }

  cambiarIdioma(codigo) {
    LANG.actual = codigo;
    localStorage.setItem('ep_lang', codigo);
    document.documentElement.lang = codigo;
    this.route();
  }

  async subirFoto(input) {
    const [archivo] = input.files;
    if (!archivo) return;
    if (archivo.size > 3 * 1024 * 1024) return this.toast('La foto supera los 3 MB', true);
    const datos = new FormData();
    datos.append('foto', archivo);
    try {
      const r = await this.api.post('/perfil/foto', datos);
      this.user.foto = r.foto;
      this.toast('Foto actualizada');
      this.route();
    } catch (e) { this.fallo(e); }
  }

  async guardarAviso(check) {
    const antes = this.user[check.dataset.k];
    this.user[check.dataset.k] = check.checked;
    try {
      await this.api.patch('/perfil/avisos', {
        avisar_vencimientos: this.user.avisar_vencimientos !== false,
        avisar_mensajes: this.user.avisar_mensajes !== false,
      });
      this.toast('Preferencia guardada');
    } catch (e) {
      this.user[check.dataset.k] = antes;
      check.checked = !check.checked;
      this.fallo(e);
    }
  }

  eventos() {
    document.addEventListener('click', async e => {
      if (e.target.classList.contains('overlay')) return this.cerrar();
      const el = e.target.closest('[data-act]');
      const accion = this.acciones[el?.dataset.act];
      if (!accion) return;
      try { await accion(el.dataset); } catch (err) { this.fallo(err); }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.cerrar();
      if (e.key === 'Enter' && e.target.matches('[data-act][tabindex]')) e.target.click();
    });

    document.addEventListener('submit', async e => {
      e.preventDefault();
      const form = e.target;
      const btn = form.querySelector('button:not([type])');
      const err = form.querySelector('.err') ?? {};
      err.textContent = '';
      btn.disabled = true;
      try { await this.formularios[form.dataset.form](Object.fromEntries(new FormData(form)), form); }
      catch (ex) { err.textContent = ex.message; }
      btn.disabled = false;
    });

    document.addEventListener('change', e => {
      const el = e.target;
      if (el.dataset.sel === 'tema') this.aplicarTema(el.value);
      if (el.dataset.sel === 'equipo') this.cargarEquipo(el);
      if (el.dataset.sel === 'imagen') this.subirImagen(el);
      if (el.dataset.sel === 'foto') this.subirFoto(el);
      if (el.dataset.sel === 'aviso') this.guardarAviso(el);
      if (el.dataset.sel === 'con-tarea') this.alternarTarea(el);
    });

    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.aplicarTema());
    window.addEventListener('hashchange', () => this.route());
  }

  iniciar() {
    iniciarTraduccion();
    this.eventos();
    this.aplicarTema();
    this.route();
  }
}

new App().iniciar();