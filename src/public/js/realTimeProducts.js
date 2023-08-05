console.log('Conectado Con Socket');
    const socket = io();
    socket.on('connect', () => {
      console.log('Conectado al servidor');
    });

    document.getElementById('productForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const title = formData.get('title');
      const description = formData.get('description');
      const price = formData.get('price');
      const thumbnail = formData.get('thumbnail');
      const code = formData.get('code');
      const category = formData.get('categoria');
      const product = { title, description, price, thumbnail, code, category };
      socket.emit('createProduct', product);
      console.log('createProduct emitido:', product);
      event.target.reset();
    });

    // Recibir los productos existentes al cargar la página
    socket.on('currentProducts', (products) => {
      console.log('currentProducts recibido:', products);

      const productList = document.getElementById('productList');
      if (!productList) {
        console.log('No se encontró el elemento productList');
        return;
      }

    // Limpiar la lista de productos existente
      productList.innerHTML = '';

    // Agregar los productos existentes a la lista
      products.forEach((product) => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
          <h2>${product.title}</h2>
          <p>Descripcion de Producto: ${product.description}</p>
          <p>Precio: ${product.price}</p>
          <p>Código: ${product.code}</p>
          <p>Categoria: ${product.category}</p>
        `;
        productList.appendChild(productItem);
      });
    });
    
    
    socket.on('newProduct', (product) => {
      console.log('newProduct recibido:', product);

      const productList = document.getElementById('productList');
      if (!productList) {
        console.log('No se encontró el elemento productList');
        return;
      }

      const productItem = document.createElement('li');
      productItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>Precio: ${product.price}</p>
        <p>Código: ${product.code}</p>
        <p>Categoria: ${product.category}</p>
      `;

      console.log('Product item creado:', productItem);
      productList.appendChild(productItem);
    });