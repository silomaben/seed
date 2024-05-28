pipeline {
    agent {
            node {
                label 'alpha'
            }
        }
    
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '5', daysToKeepStr: '', numToKeepStr: '5')
    }
    
    environment {
        uiPod = ''
        cypressPod = ''
        logs = ''
        deploy = false
    }

    stages {

         stage('Docker hub authentication'){
            steps{
                script{
                                // Create Secret to access dockerhub
                    def docsecretExists = sh(script: "kubectl --namespace=cypress get secret regcred", returnStatus: true) == 0
                    if (docsecretExists) {
                        echo "Secret regcred already exists."
                    } else {
                        // Create the secret
                        def DOCKER_EMAIL = 'software@cerebriai.com'
                        withCredentials([usernamePassword(credentialsId: 'docker-sw',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS')]) {
                            sh """
                                kubectl create secret docker-registry regcred \
                                    --docker-server=https://index.docker.io/v1/ \
                                    --docker-username=${DOCKER_USER} \
                                    --docker-password=${DOCKER_PASS} \
                                    --docker-email=${DOCKER_EMAIL} \
                                    --namespace=cypress
                                """
                        }
                    }
                }
                    
                
            }
        }
         

       stage('Kill pods if running') {
            steps {
                script {

                    // Initialize variables to track pod and pipeline status
                    def firstRunCompleted = false
                    def breakLoop = false
                    def podsFound = false

                    // Loop until pods are not found or for a specific number of iterations
                    def maxIterations = 5 
                    def currentIteration = 0
                    

                    while (currentIteration < maxIterations && breakLoop==false) {
                        echo "Checking pod existence and statuses..."
                        def podStatuses = checkExistence()
                        
                        def uiAppExists = podStatuses['uiAppExists']
                        
                        def uiAppServiceExists = podStatuses['uiAppServiceExists']
                        def e2eTestJobExists = podStatuses['e2eTestJobExists']
                        def podStatusesJson = podStatuses['podStatuses']






                        // Check if any pods are found
                        if ( uiAppExists ||  uiAppServiceExists || e2eTestJobExists || podStatusesJson.contains("Terminating")) {

                            // Delete pods only if it's the first time they are found
                            if (!firstRunCompleted) {
                                echo "Deleting pods..."
                                
                                if (uiAppExists) {
                                    sh "kubectl delete -n cypress deployment ui-app"
                                }
                                
                                if (uiAppServiceExists) {
                                    sh "kubectl delete -n cypress service ui-app-service"
                                }
                                if (e2eTestJobExists) {
                                    sh "kubectl delete -n cypress job e2e-test-app-job"
                                }

                                firstRunCompleted = true
                                podsFound = true
                            } else {
                                echo "Not all pods have finished terminating. Waiting 15 secs for pods to terminate..."
                                sleep 15 
                            }
                        } else {
                            echo "No running or terminating pods. Proceeding to create testing pods..."
                            breakLoop = true
                        }

                        currentIteration++
                    }

                    if (!podsFound) {
                        echo "No pods found or terminated."
                    }
                    
                }
            }
        }

    
        
        stage('Start UI Pod') {
            steps {
                script {                            
                        sh "kubectl apply -f ui/kubernetes"
                    }
                }
            }
        

         stage('Get UI Pod Name') {
            steps {
                script {
                        
                        uiPod = sh(script: 'kubectl get pods -n cypress -l app=ui-app -o jsonpath="{.items[0].metadata.name}"', returnStdout: true).trim()
                        echo "Found UI pod name: $uiPod"
                    
                }
            }
        }

        stage('Run Cypress E2E Job') {
            steps {
                script {
                    def retries = 24
                    def delaySeconds = 15
                    def attempts = 0


                    retry(retries) {

                        attempts++

                        echo "Finding UI pod...Attempt ${attempts}"

                        def podStatus = sh(script: "kubectl get pod $uiPod -n cypress -o jsonpath='{.status.phase}'", returnStdout: true).trim()
                        echo "Pod Status: $podStatus"

                        sh "kubectl describe pod/$uiPod -n cypress"
                        // sh "kubectl logs -n cypress $uiPod -c e2e-test-app"

                        if (podStatus == 'Running') {
                            echo "Found UI. Starting Cypress Job"

                            // delete old cypress report if it exists
                            while (fileExists(uiPod,'cypress','/shared/cypress/reports/html/index.html')) {
                                echo "Found old report. Deleting it now..."
                                sh "kubectl exec -n cypress $uiPod -- rm /shared/cypress/reports/html/index.html"
                                sh "kubectl exec -n cypress $uiPod -- rm -rf /shared/cypress/reports/html/videos"
                                sh "kubectl exec -n cypress $uiPod -- rm -rf /shared/cypress/reports/videos"
                                
                            }

                            // run cypress job 
                            sh 'kubectl apply -f cypress/kubernetes'
                        } else {
                            echo "UI pod not yet found/up. Returned status code - ${statusCode} when probed"
                            echo "Retrying in ${delaySeconds} seconds..."
                            sleep delaySeconds
                        } 
                        
                    }
                }
            }
        }


        stage('Get Cypress Job Pod Name') {
            steps {
                script {
                        cypressPod = sh(script: "kubectl get pods -n cypress -l job-name=e2e-test-app-job -o jsonpath='{.items[0].metadata.name}'", returnStdout: true).trim()
                        echo "Found Cypress pod name: $cypressPod"
                    
                }
            }
        }

            

        stage('Wait for tests to run and generate report') {
            steps {
                script {

                    echo "Awaiting report generation"
                    sleep 30

                    waitForReport(uiPod)


                    // echo "delete videos"
                    // sh "kubectl exec -n cypress $uiPod -- rm -rf /shared/cypress/reports/html/videos"
                    // sh "kubectl exec -n cypress $uiPod -- rm -rf /shared/cypress/reports/videos"

                    sh "kubectl exec -n cypress $uiPod -- cat /shared/cypress/reports/html/index.html > report_build_${env.BUILD_NUMBER}.html"
                    sh "kubectl exec -n cypress $uiPod -- cat /shared/cypress/reports/videos/Login.cy.ts.mp4 > Login_Video_build_${env.BUILD_NUMBER}.mp4"
                    

                    archiveArtifacts artifacts: "Login_Video_build_${env.BUILD_NUMBER}.mp4", onlyIfSuccessful: true
                    archiveArtifacts artifacts: "report_build_${env.BUILD_NUMBER}.html", onlyIfSuccessful: true

                }
            }
        }

        stage('Get test outcomes and write email if failure') {
            steps {
                script {

                    def logs
                    def finished = false
                    
                    // Loop until "Container execution finished" is found in the logs...this is because initially logs were being printed half way
                    while (!finished) {

                        // capture logs
                        logs = sh(script: "kubectl logs -n cypress $cypressPod -c e2e-test-app", returnStdout: true).trim()
                        
                        if (logs.contains("Container execution finished")) {
                            // Print the captured logs
                            echo "${logs}"
                            finished = true
                        } else {                            
                            sleep 5 
                        }
                    }

                    

                    if (logs.contains("All specs passed")) {
                        echo "All tests passed!"

                    } else {
                        def currentTime = new Date().format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone('UTC'))
                        emailext body: 'Hello Team,

                                        The end-to-end (E2E) Cypress tests have encountered failures in the recent Jenkins build #${env.BUILD_NUMBER}.',
                                subject: "ALERT: E2E Test Failures in Jenkins at ${currentTime}",
                                to: 'benard.masikonde@griffinglobaltech.com',
                                attachmentsPattern: "report_build_${env.BUILD_NUMBER}.html,Login_Video_build_${env.BUILD_NUMBER}.mp4"

                        error "Some tests failed. Investigate and take necessary actions... Stopping pipeline."
                    }


                }
            }
        }



        stage('Deploy') {
            steps {
                script {                 
                    if(deploy==true){
                        echo "Niiice!!! Deploying CerebriAI ATQ now."
                    } 
                }
            }
        }

        

    }

     post {
        always{
            sh "kubectl delete -n cypress deployment ui-app"
            sh "kubectl delete -n cypress job e2e-test-app-job"
            sh "kubectl delete -n cypress service ui-app-service"   
        }
    }
}

def waitForReport(podName) {
    timeout(time: 10, unit: 'MINUTES') {
        script {
            def counter = 0 
            while (!fileExists(podName,'cypress','/shared/cypress/reports/html/index.html')) {
                // sh "kubectl exec -n cypress $uiPod -- ls -la /shared/cypress/reports"
                // sh "kubectl get -n cypress job e2e-test-app-job"
                sh "kubectl logs -n cypress $cypressPod -c e2e-test-app"
                counter++ 
                echo "Waiting for index.html file to exist... (Attempt ${counter})"
                sleep 20 
            }
        }
    }
}


def fileExists(podName, namespace, filePath) {
    def command = "kubectl exec -it -n ${namespace} ${podName} -- ls ${filePath}"
    return sh(script: command, returnStatus: true) == 0
}



def checkExistence() {
        // Check if ui-app deployment exists
        def uiAppExists = sh(
            script: "kubectl get -n cypress deployment ui-app >/dev/null 2>&1",
            returnStatus: true
        ) == 0

        // Check if ui-app-service exists
        def uiAppServiceExists = sh(
            script: "kubectl get -n cypress service ui-app-service >/dev/null 2>&1",
            returnStatus: true
        ) == 0

        // Check if e2e-test-app-job job exists
        def e2eTestJobExists = sh(
            script: "kubectl get -n cypress job e2e-test-app-job >/dev/null 2>&1",
            returnStatus: true
        ) == 0

        // Get pod statuses
         def podStatuses = sh(
                        script: 'kubectl -n cypress get all',
                        returnStdout: true
                    ).trim()
    
    

    return [ uiAppExists: uiAppExists,  uiAppServiceExists: uiAppServiceExists, 
            e2eTestJobExists: e2eTestJobExists, podStatuses: podStatuses]
}
