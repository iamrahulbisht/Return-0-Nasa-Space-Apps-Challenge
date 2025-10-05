// Initialize charts for researcher dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('researcher-dashboard')) {
        initializeCharts();
    }
});

function initializeCharts() {
    // Accuracy Trend Chart
    const accuracyCtx = document.getElementById('accuracyChart');
    if (accuracyCtx) {
        new Chart(accuracyCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Accuracy %',
                    data: [89, 91, 90, 92, 93, 92, 92.5],
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 85,
                        max: 100,
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Confidence Distribution Chart
    const confidenceCtx = document.getElementById('confidenceChart');
    if (confidenceCtx) {
        new Chart(confidenceCtx, {
            type: 'bar',
            data: {
                labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
                datasets: [{
                    label: 'Number of Predictions',
                    data: [12, 45, 128, 456, 606],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.6)',
                        'rgba(251, 191, 36, 0.6)',
                        'rgba(59, 130, 246, 0.6)',
                        'rgba(139, 92, 246, 0.6)',
                        'rgba(34, 197, 94, 0.6)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Feature-wise Errors Chart
    const errorCtx = document.getElementById('errorChart');
    if (errorCtx) {
        new Chart(errorCtx, {
            type: 'bar',
            data: {
                labels: ['Star Temp', 'Orbit Period', 'Planet Radius', 'Distance', 'Star Mass', 'Star Radius'],
                datasets: [{
                    label: 'Error Rate %',
                    data: [5.2, 7.8, 6.1, 8.5, 4.9, 5.5],
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Calibration Plot
    const calibrationCtx = document.getElementById('calibrationChart');
    if (calibrationCtx) {
        new Chart(calibrationCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Predicted vs Actual',
                    data: [
                        {x: 0.1, y: 0.12},
                        {x: 0.3, y: 0.28},
                        {x: 0.5, y: 0.52},
                        {x: 0.7, y: 0.68},
                        {x: 0.9, y: 0.91}
                    ],
                    backgroundColor: 'rgba(139, 92, 246, 0.6)'
                },
                {
                    label: 'Perfect Calibration',
                    data: [
                        {x: 0, y: 0},
                        {x: 1, y: 1}
                    ],
                    type: 'line',
                    borderColor: 'rgba(34, 197, 94, 0.8)',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        title: {
                            display: true,
                            text: 'Actual Probability',
                            color: '#fff'
                        }
                    },
                    x: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        title: {
                            display: true,
                            text: 'Predicted Probability',
                            color: '#fff'
                        }
                    }
                }
            }
        });
    }
}
