# Elasticsearch Docker Container

## Usage

This container expects you to configure basically everything through the `-Des.variable=blah` settings. The config shipped with it only sets the data storage locations. You'll probably want to bind a volume to `/var/lib/elasticsearch` unless you're just doing simple testing.

```shell
docker run -i -t \
  -e ES_HEAP_SIZE=1G \
  -v /host/data/path:/var/lib/elasticsearch \
  philk/elasticsearch \
  -Des.cluster.name=MyCluster \
  -Des.node.name=DockerES
```

etc, etc. You can see the [Elasticsearch Configuration docs][1] for more info on how this works.

[1]: http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup-configuration.html
