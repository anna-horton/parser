<template>
    <Content >
      <h1>Административная панель</h1>
      <div class="page-content">
        <Card :bordered="false">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            Classic film
          </p>
          <Button slot="extra">
            <Icon type="ios-add-circle"></Icon>
            Добавить
          </Button>
        </Card>
      </div>

    </Content>
</template>

<script>

export default {
  name: 'AdminPage',
}
</script>


<style>

</style>
