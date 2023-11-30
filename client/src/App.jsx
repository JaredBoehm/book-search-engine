import './App.css'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'

import Navbar from './components/Navbar'

const httpLink = createHttpLink({
    uri: '/graphql',
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})

useEffect(() => {
    window.location.reload()
}, [location.pathname])

function App() {
    return (
        <ApolloProvider client={client}>
            <Navbar />
            <Outlet />
        </ApolloProvider>
    )
}

export default App