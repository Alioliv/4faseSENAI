import React from 'react'


const Login = () => {
    const [form, setForm] = React.useState({
        email: '',
        password: ''
    })

    const[email, setEmail] = useState('');
    const[senha, setSenha] = useState('');
    


  return (
    <div>
        <form action="">
            <div></div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" value={form.email} onChange={(e) => setForm({})} />
            </div>
            <button type="submit">Entrar</button>
        </form> 

    </div>
  )
}

export default Login
