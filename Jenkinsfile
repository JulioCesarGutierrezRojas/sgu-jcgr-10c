pipeline {
    agent any

    stages {
        // Etapa para parar tdos los servicios
        stage('Parando los servicios') {
            steps {
                script {
                    echo 'Deteniendo contenedores (Windows)...'
                    // Detener y eliminar contenedores y volúmenes asociados
                    bat '''
                        docker compose -p sgu-jcgr-10c down -v || echo Compose down falló, intentando docker rm
                        docker rm -f sgu-database sgu-frontend sgu-backend 2>nul || echo No hay contenedores para eliminar
                        exit /b 0
                        '''
                }
            }
        }

        // Elimianr las imagenes anteriores  
        stage('Borrando imagenes antiguas') {
            steps {
                script {
                    echo 'Eliminando imagenes antiguas...'
                    bat '''
                        @echo off
                        for /f "delims=" %%a in ('docker images -q sgu-jcgr-10c') do (
                            echo Eliminando imagen %%a
                            docker rmi -f %%a || echo Falló al eliminar %%a
                        )
                        exit /b 0
                    '''
                }
            }
        }

        // Bajar la ctualizacion mas reciente
        stage('Actualizando..') {
            steps {
                checkout scm
            }
        }

        // Ñevantar y despegar el proyecto
        stage('Levantando los servicios') {
            steps {
                script {
                    echo 'Levantando contenedores...'
                    bat 'docker compose -p sgu-jcgr-10c up -d --build'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado.'
        }
        success {
            echo 'Pipeline ejecutado exitosamente.'
        }
        failure {
            echo 'Error al ejecutar el pipeline.'
        }
    }
}