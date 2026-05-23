import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Miembros from './pages/Miembros';
import RotacionForm from './pages/RotacionForm';
import RotacionDetail from './pages/RotacionDetail';
import RotacionesList from './pages/RotacionesList';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0C2C55',
            light: '#296374',
            dark: '#081F3D'
        },

        secondary: {
            main: '#629FAE',
            light: '#8BBCC7',
            dark: '#4C8694'
        },

        background: {
            default: '#f8f8f8',
            paper: '#ffffff'
        },

        text: {
            primary: '#0C2C55',
            secondary: '#296374'
        },

        info: { main: '#629FAE' },
        success: { main: '#2e7d32' },
        warning: { main: '#ed6c02' },
        error: { main: '#d32f2f' }
    },

    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',

        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.5px'
        },

        h3: {
            fontWeight: 800,
            letterSpacing: '-1px',
            color: '#0C2C55'
        },

        h4: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#0C2C55'
        },

        h5: {
            fontWeight: 700
        },

        h6: {
            fontWeight: 600
        }
    },

    shape: {
        borderRadius: 16
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 700,
                    textTransform: 'none'
                },

                contained: {
                    backgroundColor: '#0C2C55',

                    boxShadow:
                        '0 10px 30px rgba(12, 44, 85, 0.25)',

                    '&:hover': {
                        backgroundColor: '#296374',

                        boxShadow:
                            '0 15px 40px rgba(12, 44, 85, 0.35)',

                        transform: 'translateY(-2px)'
                    }
                },

                outlined: {
                    borderColor: '#629FAE',
                    borderWidth: 2,
                    color: '#0C2C55',

                    '&:hover': {
                        backgroundColor: '#EEF5F7',
                        borderColor: '#296374'
                    }
                }
            }
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow:
                        '0 4px 20px rgba(0, 0, 0, 0.08)',

                    border:
                        '1px solid rgba(12, 44, 85, 0.08)',

                    backgroundColor: '#ffffff'
                },

                elevation0: {
                    boxShadow: 'none',
                    border: '1px solid #d7e3e7'
                }
            }
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0C2C55',

                    boxShadow:
                        '0 8px 32px rgba(12, 44, 85, 0.2)',

                    backdropFilter: 'blur(10px)',

                    borderBottom:
                        '1px solid rgba(255,255,255,0.08)'
                }
            }
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        backgroundColor: '#0C2C55',

                        color: '#ffffff',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                    }
                }
            }
        },

        MuiAccordion: {
            styleOverrides: {
                root: {
                    '&:before': {
                        display: 'none'
                    },

                    borderRadius: '16px !important',
                    overflow: 'hidden',
                    border: '1px solid #d7e3e7',

                    '&.Mui-expanded': {
                        borderColor: '#629FAE'
                    }
                }
            }
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,

                        '&:hover fieldset': {
                            borderColor: '#629FAE'
                        },

                        '&.Mui-focused fieldset': {
                            borderColor: '#0C2C55',
                            borderWidth: 2
                        }
                    }
                }
            }
        }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <style>{`
                * { transition: background-color 0.3s ease, color 0.3s ease; }
                ::-webkit-scrollbar { width: 10px; }
                ::-webkit-scrollbar-track { background: #f8fafc; }
                ::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.35); border-radius: 999px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.55); }
            `}</style>
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/rotaciones" element={<ProtectedRoute><RotacionesList /></ProtectedRoute>} />
                        <Route path="/miembros" element={<ProtectedRoute><Miembros /></ProtectedRoute>} />
                        <Route path="/rotaciones/nueva" element={<ProtectedRoute><RotacionForm /></ProtectedRoute>} />
                        <Route path="/rotaciones/:id" element={<ProtectedRoute><RotacionDetail /></ProtectedRoute>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
