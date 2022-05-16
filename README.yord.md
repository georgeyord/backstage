# Backstage

## Installation

### Local sample


[Helm](https://backstage.io/docs/deployment/helm) [chart](https://github.com/backstage/backstage/tree/master/contrib/chart/backstage):

Create a `values.yaml`

Install chart:

```bash
cd /opt/codebase/lenses/lenses-notes/notes/dx/backstage/backstage/contrib/chart/backstage
kubens backstage
helm install -f ./values.yaml -f ./values.custom.yaml backstage .
```

Uninstall chart:

```bash
kubens backstage
helm uninstall backstage
```