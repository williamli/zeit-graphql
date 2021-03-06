import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { Build } from './types/buildsInDeployment'
import { Deployment } from './types/deployment'
import { SuccintDeployment } from './types/deployments'
import { ZeitGqlContext } from './types/resolverTypes'
import { File } from './types/sharedTypeDefs'

export class ZeitAPI extends RESTDataSource<ZeitGqlContext> {
  constructor() {
    super()
    this.baseURL = 'https://api.zeit.co/'
  }

  public async getDeployments(teamId?: string): Promise<SuccintDeployment[]> {
    const endpoint = withTeamId(`/v3/now/deployments`, teamId)

    const { deployments }: { deployments: SuccintDeployment[] } = await this.get(endpoint)
    return deployments
  }

  public getDeployment(deploymentId: string, teamId?: string): Promise<Deployment> {
    const endpoint = withTeamId(`/v8/now/deployments/${deploymentId}`, teamId)

    return this.get(endpoint)
  }

  public getDeploymentFiles(deploymentId: string, teamId?: string): Promise<File[]> {
    const endpoint = withTeamId(`/v5/now/deployments/${deploymentId}/files`, teamId)

    return this.get(endpoint)
  }

  public getDeploymentFile(deploymentId: string, fileId: string, teamId?: string): Promise<string> {
    const endpoint = withTeamId(`/v5/now/deployments/${deploymentId}/files/${fileId}`, teamId)

    return this.get(endpoint)
  }

  public async getDeploymentBuilds(deploymentId: string, teamId?: string): Promise<Build[]> {
    const endpoint = withTeamId(`/v5/now/deployments/${deploymentId}/builds`, teamId)

    const { builds }: { builds: Build[] } = await this.get(endpoint)
    return builds
  }

  protected willSendRequest(request: RequestOptions) {
    request.headers.set('Authorization', this.context.authToken)
  }
}

function withTeamId(endpoint: string, teamId?: string): string {
  return `${endpoint}${teamId ? '?teamId=' + teamId : ''}`
}
