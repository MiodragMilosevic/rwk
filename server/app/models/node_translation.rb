class NodeTranslation < Translation
  validates :node_id, presence: true

  belongs_to :node
end
