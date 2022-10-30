/*Definir array de servicios*/

const Arrayserv = [
    {
    "1": "Clases personalizadas",
    costo:250
    },
    {
    "2":"Regularización",
    costo:200
    },
    {
    "3": "Español para extranjeros",
    costo:250
    },
    {
    "4": "Grupos de conversación",
    costo:200
    }
]
 //variables

const servicios = document.getElementById ('servicioscatalogo')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const template = document.getElementById('template').content
const templatefooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

/*Pasar Array de servicios a Json para local storage*/
const servArray =JSON.stringify (Arrayserv)
localStorage.setItem ("Servicios", servArray)


/*Fetch catalogo de servicios y eventos*/

document.addEventListener('DOMContentLoaded',() => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
servicios.addEventListener('click',e =>{
    agregarAlCarrito(e)
})
})
items.addEventListener('click', e =>{
    botonaccion(e) 
})

const fetchData = async () => {
    try {
        const res = await fetch('data.json')
        const data = await res.json()
        pintarDOM(data)

    } catch (error) {
        console.log (error)
    }
}

/*Pasar a DOM catalogo*/

const pintarDOM = data => {
    data.forEach(servicio => {
        template.querySelector('h2').textContent = servicio.nombre
        template.querySelector('h3').textContent = servicio.costo
        template.querySelector('button').dataset.id = servicio.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    servicios.appendChild(fragment)
}

/*Definir carrito Carrito*/

const agregarAlCarrito = e =>{
    
    if(e.target.classList.contains('btn')){
       setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto =>{
    const producto = {
        id: objeto.querySelector('.btn').dataset.id,
        nombre: objeto.querySelector('h2').textContent,
        costo: objeto.querySelector('h3').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}

// Mostrar carrito en DOM

const pintarCarrito = () => {

    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.costo
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarfooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarfooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row">Carrito vacio</th>
        `
        return
    }
    const suma = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad ,0)
    const totalapagar = Object.values(carrito).reduce((acc,{cantidad,costo}) => acc + cantidad*costo ,0)

    templatefooter.querySelectorAll('td')[0].textContent = suma
    templatefooter.querySelector('span').textContent = totalapagar

    const clone = templatefooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const botonvaciar = document.getElementById('vaciar-carrito')
    botonvaciar.addEventListener('click',() =>{
        carrito = {}
        pintarCarrito()
    })
}

//botones aumentar o reducir
const botonaccion = e =>{
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad===0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

/*Eventos en el formulario */

const formulario = document.querySelector ("form")

const nombre = document.querySelector ("#uname")

const telefono = document.querySelector ("#tel")

const correo = document.querySelector ("#mail")

const serv = document.querySelector ("#serv")

formulario.addEventListener("submit", validarformulario)

function validarformulario (e){
    e.preventDefault()
    Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Uno de nuestros especialistas de aprendizaje se pondra en contacto con usted',
        showConfirmButton: false,
        timer: 2000
      })
      
}

