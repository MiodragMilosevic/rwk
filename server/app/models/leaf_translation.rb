class LeafTranslation < Translation
  validates :leaf_id, presence: true

  belongs_to :leaf
end
