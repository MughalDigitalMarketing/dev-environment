Production deployment notes

This document explains how to build, publish, and deploy the application image and Kubernetes manifests.

1) Build & publish (GitHub Actions)
- The workflow .github/workflows/deploy.yml builds a multi-arch Docker image using Docker Buildx and pushes it to GitHub Container Registry (GHCR):
  - ghcr.io/MughalDigitalMarketing/dev-environment:latest
  - ghcr.io/MughalDigitalMarketing/dev-environment:<sha>
- No extra secrets are required to push to GHCR when running in this repository's Actions runner (it uses GITHUB_TOKEN). For organization repositories you may need to grant the Actions runner permissions to publish packages — see GitHub docs.

2) Deploy to Kubernetes (automated)
- The workflow has a job deploy-to-k8s which runs only if the repository secret KUBE_CONFIG is set.
- Add a repository secret named KUBE_CONFIG that contains your kubeconfig file base64-encoded. Example:
  - cat ~/.kube/config | base64 | pbcopy
  - Then add the base64 string as a repo secret named KUBE_CONFIG.
- The workflow will update the deployment image to the just-built image and rollout the update.

3) Manual deploy with kubectl
- Ensure kubectl is configured and authenticated to your cluster.
- Apply secrets (recommended to create the secret from env values):
  kubectl create secret generic dev-env-secrets \
    --from-literal=DATABASE_URL='postgresql://user:pass@host:5432/db' \
    --from-literal=REDIS_URL='redis://host:6379' \
    --from-literal=JWT_SECRET='your-secret'
- Apply manifests:
  kubectl apply -f k8s/secret.yaml
  kubectl apply -f k8s/deployment.yaml
  kubectl apply -f k8s/service.yaml
  kubectl apply -f k8s/hpa.yaml

4) Heroku (optional)
- The workflow includes a commented Heroku deploy job template. To enable it, add HEROKU_API_KEY and HEROKU_APP_NAME as repository secrets and uncomment the job in .github/workflows/deploy.yml.

5) docker-compose.prod.yml
- For simple VPS or PaaS environments that run docker-compose you can use docker-compose.prod.yml which references Dockerfile.prod and expects DATABASE_URL and REDIS_URL environment variables to be provided.

Security & secrets
- Do NOT commit production credentials. Use GitHub repository secrets for Actions and Kubernetes secrets for clusters.

Questions or changes
- If you want automatic image tags, Canary deployments, or GitOps-style manifests (ArgoCD/Flux), tell me which approach and I will add the configuration.
