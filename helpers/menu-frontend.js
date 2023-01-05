const getMenuFrontEnd = (role = 'USER_ROLE')=>{
    const menu =  [
        {
          titulo: 'Dashboard',
          icono: 'mdi mdi-gauge',
          subMenu: [
            {titulo: 'Main', url: '/'},
            {titulo: 'Gráfica', url: 'grafica1'},
            {titulo: 'Promesas', url: 'promesas'},
            {titulo: 'ProgressBar', url: 'progress'},
            {titulo: 'Rxjs', url: 'rxjs'}
          ]
        },
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          subMenu: [
            /* {titulo: 'Usuarios', url: 'usuarios'}, */
            {titulo: 'Hospitales', url: 'hospitales'},
            {titulo: 'Médicos', url: 'medicos'},
          ]
        }
      ];

      if (role === 'ADMIN_ROLE') {
        /* si es usuario aministrador agregamos en la primera posición del submenu '{titulo: 'Usuarios', url: 'usuarios'}' */
        menu[1].subMenu.unshift({titulo: 'Usuarios', url: 'usuarios'})
      }
      return menu;

}

module.exports = {
  getMenuFrontEnd
}