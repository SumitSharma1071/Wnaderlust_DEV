(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

 let totalPrice = document.getElementById('tax-switch');
     let infotax = document.getElementsByClassName('tax-toggle');
      totalPrice.addEventListener('click', () =>{
            for(let info of infotax){
               if(info.style.display !== 'inline'){
                  info.style.display = 'inline';
               }else{
                info.style.display = 'none';
               }
            }
      });

        function scrollCat(value){
  document.getElementById("categorySlider")
  .scrollBy({left:value, behavior:"smooth"});
}