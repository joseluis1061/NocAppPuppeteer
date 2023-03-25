import React from 'react'
import '../styles/ModalEditSite.css';
import { Formik, Form, Field } from 'formik';
import Alerta from './Alerta';
import * as Yup from 'yup';
import axios from 'axios';
//
export const ModalEditSite = (props) => {
  const { show, closeModal, sitio } = props;

  const nuevaTorreSchema = Yup.object().shape({
    codigo_Tower_One: Yup.string()
      .min(3, 'El nombre es muy corto')  
      .max(10, 'El nombre es muy largo')
      .required('El nombre de la torre es obligatorio'),
    proveedor_TX: Yup.string()
      .required('El nombre de la empresa es obligatorio'),
    contacto_proveedor_TX_nivel_1: Yup.string()
      .email('Email no valido')
  })

  const handleSubmit = async (values) =>{
    const sitioAux = {"sitio": sitio.sitio};
    values = {...sitioAux, ...values}
    try{
      let response; 
      //Editando sitio existente
      if(sitio.id){
        const url = `https://djangonocv1.onrender.com/sitioRadII/${sitio.id}`;
        response = await axios({
          method: 'put',
          url: url,
          data: values
        });

      }else{
        //Nuevo sitio
        const url = "https://djangonocv1.onrender.com/sitiosRadd/";
        response = await axios({
          method: 'POST',
          url: url,
          data: values,
          headers:{
            'Content-Type': 'application/json'
          }      
        });
      }     
      await response;
      closeModal();
    }catch(error){
      console.log(error)
    }
  };

  // const formik = useFormik({
  //   initialValues:{
  //     codigo_Tower_One : sitio.codigo_Tower_One,
  //     acciones_TX_en_falla : sitio.acciones_TX_en_falla,
  //     proveedor_TX : sitio.proveedor_TX,
  //     cabecera_TX_SAT : sitio.cabecera_TX_SAT,
  //     cabecera_TX_EXT : sitio.cabecera_TX_EXT,
  //     ruta_TX : sitio.ruta_TX,
  //     ultima_milla : sitio.ultima_milla,
  //     contacto_proveedor_TX_nivel_1 : sitio.contacto_proveedor_TX_nivel_1,
  //     coordenadas : sitio.coordenadas,
  //     municipio : sitio.municipio, 
  //     departamento : sitio.departamento,
  //     fecha_integracion_RADII : sitio.fecha_integracion_RADII,
  //     orion_Web_LTE : sitio.orion_Web_LTE,
  //     orion_Web_SAT: sitio.orion_Web_SAT
  //   },
  //   validationSchema: Yup.object({
  //     codigo_Tower_One: Yup.string()
  //       .min(3, 'El nombre es muy corto')  
  //       .max(10, 'El nombre es muy largo')
  //       .required('El nombre de la torre es obligatorio'),
  //     proveedor_TX: Yup.string()
  //       .required('El nombre de la empresa es obligatorio'),
  //     contacto_proveedor_TX_nivel_1: Yup.string()
  //       .email('Email no valido'),
  //     //  .required('El email es obligatorio'),

  //     //contacto_proveedor_TX_nivel_1: Yup.number()
  //     //   .integer('El número no es valido')
  //     //   .positive('El número no es valido')
  //     //   .typeError('El número no es valido'),
  //   }),
  //   onSubmit: values => {
  //     console.log("Submit");
  //     console.log(values);
  //   }
  // })
  return (
    <>
      <div className={show ? "overlay" : "hide"}>
        <div className={`${show ? "modal" : "hide"} `}>
          <button onClick={closeModal}>X</button>
          <h1>Editar Sitio {sitio.sitio}</h1>

          <Formik
            initialValues={{
              codigo_Tower_One : sitio.codigo_Tower_One ?? "",
              acciones_TX_en_falla : sitio.acciones_TX_en_falla ?? "",
              proveedor_TX : sitio.proveedor_TX ?? "",
              cabecera_TX_SAT : sitio.cabecera_TX_SAT ?? "",
              cabecera_TX_EXT : sitio.cabecera_TX_EXT ?? "",
              ruta_TX : sitio.ruta_TX ?? "",
              ultima_milla : sitio.ultima_milla ?? "",
              contacto_proveedor_TX_nivel_1 : sitio.contacto_proveedor_TX_nivel_1 ?? "",
              coordenadas : sitio.coordenadas ?? "",
              municipio : sitio.municipio ?? "", 
              departamento : sitio.departamento ?? "",
              fecha_integracion_RADII : sitio.fecha_integracion_RADII ?? "",
              orion_Web_LTE : sitio.orion_Web_LTE ?? "",
              orion_Web_SAT: sitio.orion_Web_SAT ?? ""
            }}
            enableReinitialize = {true}
            onSubmit = {async (values, {resetForm}) =>{
              await handleSubmit(values);
              resetForm();
            }}
            validationSchema = {nuevaTorreSchema}
          >
            {({errors, touched})=>{
          
            return(        
              <Form className='form-raddII'>

                <div>
                  <label>
                    Código Tower One:
                  </label>
                  <Field 
                    type="text" 
                    name="codigo_Tower_One" 
                    id="codigo_Tower_One" 
                    placeholder = 'Código Tower One'
                  />
                  {
                  errors.codigo_Tower_One && touched.codigo_Tower_One? 
                    (
                      <Alerta>{errors.codigo_Tower_One}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Acciones TX en falla:
                  </label>
                  <Field 
                    type="text" 
                    name="acciones_TX_en_falla" 
                    id="acciones_TX_en_falla" 
                    placeholder = 'Acciones TX en falla'
                  />
                  {
                  errors.acciones_TX_en_falla && touched.acciones_TX_en_falla? 
                    (
                      <Alerta>{errors.acciones_TX_en_falla}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Proveedor TX:
                  </label>
                  <Field 
                    type="text" 
                    name="proveedor_TX" 
                    id="proveedor_TX" 
                    placeholder = 'Proveedor TX:'
                  />
                  {
                  errors.proveedor_TX && touched.proveedor_TX? 
                    (
                      <Alerta>{errors.proveedor_TX}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Cabecera TX SAT:
                  </label>
                  <Field 
                    type="text" 
                    name="cabecera_TX_SAT" 
                    id="cabecera_TX_SAT" 
                    placeholder = 'Cabecera TX SAT'
                  />
                  {
                  errors.cabecera_TX_SAT && touched.cabecera_TX_SAT? 
                    (
                      <Alerta>{errors.cabecera_TX_SAT}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Cabecera TX EXT:
                  </label>
                  <Field 
                    type="text" 
                    name="cabecera_TX_EXT" 
                    id="cabecera_TX_EXT" 
                    placeholder = 'Cabecera TX EXT'
                  />
                  {
                  errors.cabecera_TX_EXT && touched.cabecera_TX_EXT? 
                    (
                      <Alerta>{errors.cabecera_TX_EXT}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Ruta TX:
                  </label>
                  <Field 
                    type="text" 
                    name="ruta_TX" 
                    id="ruta_TX" 
                    placeholder = 'Ruta TX'
                  />
                  {
                  errors.ruta_TX && touched.ruta_TX? 
                    (
                      <Alerta>{errors.ruta_TX}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Última milla:
                  </label>
                  <Field 
                    type="text" 
                    name="ultima_milla" 
                    id="ultima_milla" 
                    placeholder = 'Última milla'
                  />
                  {
                  errors.ultima_milla && touched.ultima_milla? 
                    (
                      <Alerta>{errors.ultima_milla}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Contacto proveedor TX nivel 1:
                  </label>
                  <Field 
                    type="text" 
                    name="contacto_proveedor_TX_nivel_1" 
                    id="contacto_proveedor_TX_nivel_1" 
                    placeholder = 'Contacto proveedor TX nivel 1'
                  />
                  {
                  errors.contacto_proveedor_TX_nivel_1 && touched.contacto_proveedor_TX_nivel_1? 
                    (
                      <Alerta>{errors.contacto_proveedor_TX_nivel_1}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Coordenadas:
                  </label>
                  <Field 
                    type="text" 
                    name="coordenadas" 
                    id="coordenadas" 
                    placeholder = 'Coordenadas'
                  />
                  {
                  errors.coordenadas && touched.coordenadas? 
                    (
                      <Alerta>{errors.coordenadas}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Municipio:
                  </label>
                  <Field 
                    type="text" 
                    name="municipio" 
                    id="municipio" 
                    placeholder = 'Municipio'
                  />
                  {
                  errors.municipio && touched.municipio? 
                    (
                      <Alerta>{errors.municipio}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Departamento:
                  </label>
                  <Field 
                    type="text" 
                    name="departamento" 
                    id="departamento" 
                    placeholder = 'Departamento'
                  />
                  {
                  errors.departamento && touched.departamento? 
                    (
                      <Alerta>{errors.departamento}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Fecha integración RADII::
                  </label>
                  <Field 
                    type="text" 
                    name="fecha_integracion_RADII" 
                    id="fecha_integracion_RADII" 
                    placeholder = 'Fecha integración RADII:'
                  />
                  {
                  errors.fecha_integracion_RADII && touched.fecha_integracion_RADII? 
                    (
                      <Alerta>{errors.fecha_integracion_RADII}</Alerta>
                    ): null
                  }
                </div>
                
                <div>
                  <label>
                    Orion Web LTE:
                  </label>
                  <Field 
                    type="text" 
                    name="orion_Web_LTE" 
                    id="orion_Web_LTE" 
                    placeholder = 'Orion Web LTE'
                  />
                  {
                  errors.orion_Web_LTE && touched.orion_Web_LTE? 
                    (
                      <Alerta>{errors.orion_Web_LTE}</Alerta>
                    ): null
                  }
                </div>

                <div>
                  <label>
                    Orion Web SAT:
                  </label>
                  <Field 
                    type="text" 
                    name="orion_Web_SAT" 
                    id="orion_Web_SAT" 
                    placeholder = 'Orion Web SAT'
                  />
                  {
                  errors.orion_Web_SAT && touched.orion_Web_SAT? 
                    (
                      <Alerta>{errors.orion_Web_SAT}</Alerta>
                    ): null
                  }
                </div>


                <input type="submit"
                  value = "Submit"
                />
              </Form>
            )}}
          </Formik>



          {/* <form className='form-raddII' onSubmit={formik.handleSubmit}>

            <div>
              <label>
                  Código Tower One:
              </label>
              <input 
                type="text" 
                name="codigo_Tower_One" 
                id="codigo_Tower_One" 
                //defaultValue={sitio.codigo_Tower_One}
                onChange={formik.handleChange}
                onBlur = {formik.handleBlur}
                value={formik.values.codigo_Tower_One}

              />
              {
                formik.touched.codigo_Tower_One && formik.errors.codigo_Tower_One?(
                  <Alerta>{formik.errors.orion_Web_SAT}</Alerta>
                ): null
              }

            </div>
            
            <div>
              <label>
                  Acciones TX en falla:
              </label>
              <input 
                type="text" 
                name="acciones_TX_en_falla" 
                id = "acciones_TX_en_falla" 
                //defaultValue={sitio.acciones_TX_en_falla}
                onChange={formik.handleChange}
                value={formik.values.acciones_TX_en_falla}
              />
            </div>

            <div>
              <label>
                  Proveedor TX:
              </label>
              <input 
                type="text" 
                name="proveedor_TX" 
                id = "proveedor_TX" 
                //defaultValue={sitio.proveedor_TX}
                onChange={formik.handleChange}
                value={formik.values.proveedor_TX}
              />
            </div>

            <div>
              <label>
                  Cabecera TX SAT:
              </label>
              <input 
                type="text" 
                name="cabecera_TX_SAT" 
                id = "cabecera_TX_SAT" 
                //defaultValue={sitio.cabecera_TX_SAT}
                onChange={formik.handleChange}
                value={formik.values.cabecera_TX_SAT}
              />
            </div>

            <div>
              <label>
                Cabecera TX EXT:
              </label>
              <input 
                type="text" 
                name="cabecera_TX_EXT" 
                id="cabecera_TX_EXT" 
                //defaultValue={sitio.cabecera_TX_EXT}
                onChange={formik.handleChange}
                value={formik.values.cabecera_TX_EXT}
              />
            </div>

            <div>
              <label>
                Ruta TX:
              </label>
              <input 
                type="text" 
                name="ruta_TX" 
                id="ruta_TX" 
                //defaultValue={sitio.ruta_TX}
                onChange={formik.handleChange}
                value={formik.values.ruta_TX}
              />
            </div>

            <div>
              <label>
                Última milla:
              </label>
              <input 
                type="text" 
                name="ultima_milla" 
                id="ultima_milla" 
                //defaultValue={sitio.ultima_milla}
                onChange={formik.handleChange}
                value={formik.values.ultima_milla}
              />
            </div>

            <div>
              <label>
                Contacto proveedor TX nivel 1:
              </label>
              <input 
                type="text" 
                name="contacto_proveedor_TX_nivel_1" 
                id="contacto_proveedor_TX_nivel_1" 
                //defaultValue={sitio.contacto_proveedor_TX_nivel_1}                
                onChange={formik.handleChange}
                value={formik.values.contacto_proveedor_TX_nivel_1}
                
              />
            </div>

            <div>
              <label>
                Coordenadas:
              </label>
              <input 
                type="text" 
                name="coordenadas" 
                id="coordenadas" 
                //defaultValue={sitio.coordenadas}
                onChange={formik.handleChange}
                value={formik.values.coordenadas}              
              />
            </div>

            <div>
              <label>
                  Municipio:
              </label>
              <input 
                type="text" 
                name="municipio" 
                id="municipio" 
                //defaultValue={sitio.municipio}
                onChange={formik.handleChange}
                value={formik.values.municipio}
              />
            </div>

            <div>
              <label>
                  Departamento:
              </label>
              <input 
                type="text" 
                name="departamento" 
                id="departamento" 
                //defaultValue={sitio.departamento}
                onChange={formik.handleChange}
                value={formik.values.departamento}
                />
            </div>

            <div>
              <label>
                  Fecha integración RADII:
              </label>
              <input 
                type="text" 
                name="fecha_integracion_RADII" 
                id="fecha_integracion_RADII" 
                //defaultValue={sitio.fecha_integracion_RADII}
                onChange={formik.handleChange}
                value={formik.values.fecha_integracion_RADII}
              />
            </div>

            <div>
              <label>
                  Orion Web LTE:
              </label>
              <input 
                type="text" 
                name="orion_Web_LTE" 
                id="orion_Web_LTE" 
                //defaultValue={sitio.orion_Web_LTE}
                onChange={formik.handleChange}
                value={formik.values.orion_Web_LTE}
                />
            </div>

            <div>
              <label>
                  Orion Web SAT:
              </label>
              <input 
                type="text" 
                name="orion_Web_SAT" //defaultValue={sitio.orion_Web_SAT}
                onChange={formik.handleChange}
                value={formik.values.orion_Web_SAT}
              />
            </div>
            
            <input type="submit" value="Submit" />
          </form>  */}

        </div>        
      </div>
    </>
  )
}

ModalEditSite.defaultProps = {
  sitio: {},
  // cargando: false
}

// sitio
// codigo_Tower_One
// acciones_TX_en_falla
// proveedor_TX
// cabecera_TX_SAT
// cabecera_TX_EXT
// ruta_TX
// ultima_milla
// contacto_proveedor_TX_nivel_1
// coordenadas
// municipio
// departamento
// fecha_integracion_RADII
// orion_Web_LTE
// orion_Web_SAT