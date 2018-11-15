import _ from 'underscore'
// 验证表单
export function validForm(form) {
  return new Promise(res => {
    form.validate(valid => res(valid))
  })
}

export function getMapFilters(map_) {
  // console.log("map_", map_, "_.pairs(map_).map(ps => ({text: ps[0], value: ps[1]}))=",_.pairs(map_).map(ps => ({text: ps[0], value: ps[1]})))
  return _.pairs(map_).map(ps => ({value: ps[0], text: ps[1]}))
}
// 删除操作 弹出提示框
/**
 *
 * @param {*} obj             传入当前对象,刷新当前table需要用到
 * @param {*} context         要删除的内容名称，必填，默认为空
 * @param {*} okCallback      确认删除回调函数，必填
 * @param {*} cancelCallback  取消删除回调函数，非必填
 */
export function deletedModal(obj, context = '', okCallback, cancelCallback) {
  let content = '<h3><p> 您确定要删除' + context + '吗？</p></h3><p style="margin-top:1.5em">确认后将删除此内容</p>'
  obj.$Modal.confirm({
    title: '',
    content: content,
    cancelText: '取消',
    okText: '确认',
    onOk: () => {
      okCallback()
    },
    onCancel: () => {
      if (cancelCallback) {
        cancelCallback()
      }
    }
  })
}